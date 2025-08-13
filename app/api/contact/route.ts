// app/api/contact/route.ts
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { contactFormSchema, contactFormResponseSchema } from "../../../schemas/contact";
import { trackContactSubmission } from "../../../lib/analytics";

// Simple in-memory rate limiting (in production, use Cloudflare KV or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // 10 requests per minute

  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  // Increment count
  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

// Extracted Turnstile verification function to avoid code duplication
async function verifyTurnstile(token: string, secret: string): Promise<{ success: boolean; errorCodes?: string[] }> {
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    });

    if (!response.ok) {
      console.error('Turnstile API error:', response.status, response.statusText);
      return { success: false, errorCodes: ['api_error'] };
    }

    const result = await response.json() as { success: boolean; "error-codes"?: string[] };
    return { success: result.success, errorCodes: result["error-codes"] };
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return { success: false, errorCodes: ['network_error'] };
  }
}

async function sendWebhookNotification(data: any, webhookUrl: string): Promise<void> {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text: `New contact message from Zishan's portfolio\n\n**Name:** ${data.name}\n**Email:** ${data.email}\n**Subject:** ${data.subject}\n**Message:** ${data.message}\n\n**Timestamp:** ${new Date().toISOString()}`,
      }),
    });

    if (!response.ok) {
      console.error('Webhook notification failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Webhook notification error:', error);
  }
}

async function logContactSubmission(data: any): Promise<void> {
  try {
    // In a real implementation, you might want to store this in a database
    // For now, we'll just log it to console and track analytics
    const submission = {
      timestamp: new Date().toISOString(),
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    };
    
    console.log('Contact form submission:', submission);
    
    // Track successful submission
    trackContactSubmission(true);
  } catch (error) {
    console.error('Error logging contact submission:', error);
  }
}

// Helper function to create consistent error responses
function createErrorResponse(
  error: string, 
  message: string, 
  status: number, 
  details?: string[],
  headers?: Record<string, string>
): Response {
  const response = contactFormResponseSchema.parse({
    success: false,
    error,
    message,
    details,
  });
  
  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
  });
}

export async function POST(req: Request) {
  const { env } = getCloudflareContext();
  
  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('cf-connecting-ip') || 
                    req.headers.get('x-forwarded-for') || 
                    'unknown';
    
    // Check rate limit
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      trackContactSubmission(false, 'rate_limit_exceeded');
      
      return createErrorResponse(
        'rate_limit_exceeded',
        'Too many requests. Please try again later.',
        429,
        undefined,
        {
          'x-ratelimit-remaining': rateLimit.remaining.toString(),
          'x-ratelimit-reset': rateLimit.resetTime.toString(),
        }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      trackContactSubmission(false, 'invalid_json');
      return createErrorResponse('invalid_json', 'Invalid request format.', 400);
    }

    // Validate form data with Zod
    let validatedData;
    try {
      validatedData = contactFormSchema.parse(body);
    } catch (error) {
      trackContactSubmission(false, 'validation_failed');
      
      const details = error instanceof Error ? [error.message] : ['Unknown validation error'];
      return createErrorResponse('validation_failed', 'Invalid form data.', 400, details);
    }

    // Verify Turnstile token
    const turnstileSecret = env.TURNSTILE_SECRET;
    if (!turnstileSecret) {
      console.error('TURNSTILE_SECRET not configured');
      trackContactSubmission(false, 'server_configuration_error');
      return createErrorResponse('server_configuration_error', 'Server configuration error.', 500);
    }

    const turnstileResult = await verifyTurnstile(validatedData.turnstileToken, turnstileSecret);
    if (!turnstileResult.success) {
      trackContactSubmission(false, 'turnstile_verification_failed');
      
      return createErrorResponse(
        'turnstile_verification_failed',
        'Security verification failed. Please try again.',
        403,
        turnstileResult.errorCodes || ['unknown_error']
      );
    }

    // Send webhook notification if configured
    const webhookUrl = env.WEBHOOK_URL;
    if (webhookUrl) {
      await sendWebhookNotification(validatedData, webhookUrl);
    }

    // Log the submission
    await logContactSubmission(validatedData);

    // Return success response
    const response = contactFormResponseSchema.parse({
      success: true,
      message: 'Message sent successfully!',
    });
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'x-ratelimit-remaining': rateLimit.remaining.toString(),
        'x-ratelimit-reset': rateLimit.resetTime.toString(),
      },
    });

  } catch (error) {
    console.error('Contact form API error:', error);
    trackContactSubmission(false, 'internal_server_error');
    
    return createErrorResponse(
      'internal_server_error',
      'An unexpected error occurred. Please try again later.',
      500
    );
  }
}
