import { describe, test, expect, vi, beforeEach } from 'vitest';

// Mock the Cloudflare context
vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: () => ({
    env: {
      TURNSTILE_SECRET: 'test-secret-key',
    },
  }),
}));

// Mock fetch for Turnstile API calls
global.fetch = vi.fn();

describe('Turnstile Verification API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should verify valid token successfully', async () => {
    // Mock successful Turnstile response
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { POST } = await import('../app/api/turnstile/verify/route');
    
    const request = new Request('http://localhost:3000/api/turnstile/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'valid-token-123' }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Token verified successfully.');
  });

  test('should reject invalid token', async () => {
    // Mock failed Turnstile response
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: false, 
        'error-codes': ['invalid-input-response'] 
      }),
    });

    const { POST } = await import('../app/api/turnstile/verify/route');
    
    const request = new Request('http://localhost:3000/api/turnstile/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'invalid-token' }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(403);
    expect(result.success).toBe(false);
    expect(result.error).toBe('turnstile_verification_failed');
    expect(result.errorCodes).toContain('invalid-input-response');
  });

  test('should handle missing token', async () => {
    const { POST } = await import('../app/api/turnstile/verify/route');
    
    const request = new Request('http://localhost:3000/api/turnstile/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: '' }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toBe('validation_failed');
  });

  test('should handle invalid JSON', async () => {
    const { POST } = await import('../app/api/turnstile/verify/route');
    
    const request = new Request('http://localhost:3000/api/turnstile/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid-json',
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toBe('invalid_json');
  });

  test('should handle network errors', async () => {
    // Mock network error
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const { POST } = await import('../app/api/turnstile/verify/route');
    
    const request = new Request('http://localhost:3000/api/turnstile/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'valid-token-123' }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(403);
    expect(result.success).toBe(false);
    expect(result.error).toBe('turnstile_verification_failed');
    expect(result.errorCodes).toContain('network_error');
  });

  test('should handle Turnstile API errors', async () => {
    // Mock API error response
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { POST } = await import('../app/api/turnstile/verify/route');
    
    const request = new Request('http://localhost:3000/api/turnstile/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'valid-token-123' }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(403);
    expect(result.success).toBe(false);
    expect(result.error).toBe('turnstile_verification_failed');
    expect(result.errorCodes).toContain('api_error');
  });
}); 