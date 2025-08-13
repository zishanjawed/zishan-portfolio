import { contactFormSchema, contactFormResponseSchema } from '../schemas/contact';

describe('Contact Form Schema Validation', () => {
  test('should validate a valid contact form submission', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Project Inquiry',
      message: 'I would like to discuss a potential project.',
      turnstileToken: 'valid-token-123',
    };

    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test('should reject invalid email', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'invalid-email',
      subject: 'Project Inquiry',
      message: 'I would like to discuss a potential project.',
      turnstileToken: 'valid-token-123',
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true);
    }
  });

  test('should reject empty required fields', () => {
    const invalidData = {
      name: '',
      email: 'john@example.com',
      subject: 'Project Inquiry',
      message: 'I would like to discuss a potential project.',
      turnstileToken: 'valid-token-123',
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('name'))).toBe(true);
    }
  });

  test('should reject message that is too long', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Project Inquiry',
      message: 'A'.repeat(2001), // Over 2000 character limit
      turnstileToken: 'valid-token-123',
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('message'))).toBe(true);
    }
  });

  test('should reject missing turnstile token', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Project Inquiry',
      message: 'I would like to discuss a potential project.',
      turnstileToken: '',
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('turnstileToken'))).toBe(true);
    }
  });
});

describe('Contact Form Response Schema Validation', () => {
  test('should validate success response', () => {
    const successResponse = {
      success: true,
      message: 'Message sent successfully!',
    };

    const result = contactFormResponseSchema.safeParse(successResponse);
    expect(result.success).toBe(true);
  });

  test('should validate error response', () => {
    const errorResponse = {
      success: false,
      error: 'validation_failed',
      message: 'Invalid form data.',
      details: ['Email is required'],
    };

    const result = contactFormResponseSchema.safeParse(errorResponse);
    expect(result.success).toBe(true);
  });

  test('should reject response without success field', () => {
    const invalidResponse = {
      message: 'Message sent successfully!',
    };

    const result = contactFormResponseSchema.safeParse(invalidResponse);
    expect(result.success).toBe(false);
  });
}); 