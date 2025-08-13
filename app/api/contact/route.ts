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
      const response = contactFormResponseSchema.parse({
        success: false,
        error: 'rate_limit_exceeded',
        message: 'Too many requests. Please try again later.',
      });
      
      // Track rate limit error
      trackContactSubmission(false, 'rate_limit_exceeded');
      
      return new Response(JSON.stringify(response), {
        status: 429,
        headers: {
          'content-type': 'application/json',
          'x-ratelimit-remaining': rateLimit.remaining.toString(),
          'x-ratelimit-reset': rateLimit.resetTime.toString(),
        },
      });
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      const response = contactFormResponseSchema.parse({
        success: false,
        error: 'invalid_json',
        message: 'Invalid request format.',
      });
      
      trackContactSubmission(false, 'invalid_json');
      
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Validate form data with Zod
    let validatedData;
    try {
      validatedData = contactFormSchema.parse(body);
    } catch (error) {
      const response = contactFormResponseSchema.parse({
        success: false,
        error: 'validation_failed',
        message: 'Invalid form data.',
        details: error instanceof Error ? [error.message] : ['Unknown validation error'],
      });
      
      trackContactSubmission(false, 'validation_failed');
      
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Verify Turnstile token
    const turnstileSecret = env.TURNSTILE_SECRET;
    if (!turnstileSecret) {
      console.error('TURNSTILE_SECRET not configured');
      const response = contactFormResponseSchema.parse({
        success: false,
        error: 'server_configuration_error',
        message: 'Server configuration error.',
      });
      
      trackContactSubmission(false, 'server_configuration_error');
      
      return new Response(JSON.stringify(response), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    const turnstileResult = await verifyTurnstile(validatedData.turnstileToken, turnstileSecret);
    if (!turnstileResult.success) {
      const response = contactFormResponseSchema.parse({
        success: false,
        error: 'turnstile_verification_failed',
        message: 'Security verification failed. Please try again.',
        details: turnstileResult.errorCodes || ['unknown_error'],
      });
      
      trackContactSubmission(false, 'turnstile_verification_failed');
      
      return new Response(JSON.stringify(response), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      });
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
    
    const response = contactFormResponseSchema.parse({
      success: false,
      error: 'internal_server_error',
      message: 'An unexpected error occurred. Please try again later.',
    });
    
    trackContactSubmission(false, 'internal_server_error');
    
    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
