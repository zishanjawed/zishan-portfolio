import { getCloudflareContext } from "@opennextjs/cloudflare";
import { z } from "zod";

const turnstileVerifySchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

const turnstileVerifyResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
  errorCodes: z.array(z.string()).optional(),
});

async function verifyTurnstileToken(token: string, secret: string): Promise<{ success: boolean; errorCodes?: string[] }> {
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

export async function POST(req: Request) {
  const { env } = getCloudflareContext();
  
  try {
    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      const response = turnstileVerifyResponseSchema.parse({
        success: false,
        error: 'invalid_json',
        message: 'Invalid request format.',
      });
      
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Validate request data
    let validatedData;
    try {
      validatedData = turnstileVerifySchema.parse(body);
    } catch (error) {
      const response = turnstileVerifyResponseSchema.parse({
        success: false,
        error: 'validation_failed',
        message: 'Invalid token data.',
      });
      
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Get Turnstile secret
    const turnstileSecret = env.TURNSTILE_SECRET;
    if (!turnstileSecret) {
      console.error('TURNSTILE_SECRET not configured');
      const response = turnstileVerifyResponseSchema.parse({
        success: false,
        error: 'server_configuration_error',
        message: 'Server configuration error.',
      });
      
      return new Response(JSON.stringify(response), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Verify Turnstile token
    const result = await verifyTurnstileToken(validatedData.token, turnstileSecret);
    
    if (result.success) {
      const response = turnstileVerifyResponseSchema.parse({
        success: true,
        message: 'Token verified successfully.',
      });
      
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    } else {
      const response = turnstileVerifyResponseSchema.parse({
        success: false,
        error: 'turnstile_verification_failed',
        message: 'Token verification failed.',
        errorCodes: result.errorCodes || ['unknown_error'],
      });
      
      return new Response(JSON.stringify(response), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Turnstile verification API error:', error);
    
    const response = turnstileVerifyResponseSchema.parse({
      success: false,
      error: 'internal_server_error',
      message: 'An unexpected error occurred.',
    });
    
    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
} 