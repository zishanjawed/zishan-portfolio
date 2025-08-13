// Test setup file
import { beforeAll } from 'vitest';
import '@testing-library/jest-dom';

beforeAll(() => {
  // Set up test environment variables
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'test-site-key';
  process.env.TURNSTILE_SECRET = 'test-secret';
}); 