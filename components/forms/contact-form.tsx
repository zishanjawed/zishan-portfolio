'use client';

import { useState } from 'react';
import Turnstile from 'react-turnstile';
import { contactFormSchema, type ContactFormData, type ContactFormResponse } from '../../schemas/contact';
import { trackFormInteraction, trackTurnstileInteraction, trackContactSubmission } from '../../lib/analytics';

interface ContactFormProps {
  siteKey: string;
}

export function ContactForm({ siteKey }: ContactFormProps) {
  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Track form interaction when user starts filling
    if (!formData[name] && value) {
      trackFormInteraction('contact', 'start', `field_${name}`);
    }
  };

  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token);
    if (errors.turnstileToken) {
      setErrors(prev => ({ ...prev, turnstileToken: '' }));
    }
    trackTurnstileInteraction('verify', 'success');
  };

  const handleTurnstileExpire = () => {
    setTurnstileToken('');
    setErrors(prev => ({ ...prev, turnstileToken: 'Verification expired. Please try again.' }));
    trackTurnstileInteraction('expire', 'token_expired');
  };

  const validateForm = (): boolean => {
    try {
      const dataToValidate = { ...formData, turnstileToken };
      contactFormSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error) {
        const zodError = error as any;
        const newErrors: Record<string, string> = {};
        
        if (zodError.errors) {
          zodError.errors.forEach((err: any) => {
            newErrors[err.path[0]] = err.message;
          });
        }
        
        setErrors(newErrors);
        trackFormInteraction('contact', 'validation_error', Object.keys(newErrors).join(','));
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    trackFormInteraction('contact', 'submit', 'attempt');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      const result: ContactFormResponse = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message! I\'ll get back to you soon.',
        });
        trackContactSubmission(true);
        trackFormInteraction('contact', 'success', 'submission_complete');
        
        // Reset form
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTurnstileToken('');
        // Reset Turnstile widget
        if (typeof window !== 'undefined' && (window as any).turnstile) {
          (window as any).turnstile.reset();
        }
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again.',
        });
        trackContactSubmission(false, result.error);
        trackFormInteraction('contact', 'error', result.error || 'unknown_error');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
      trackContactSubmission(false, 'network_error');
      trackFormInteraction('contact', 'error', 'network_error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Your name"
          aria-describedby={errors.name ? 'name-error' : undefined}
          disabled={isSubmitting}
          required
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email || ''}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="your.email@example.com"
          aria-describedby={errors.email ? 'email-error' : undefined}
          disabled={isSubmitting}
          required
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject || ''}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.subject ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="What's this about?"
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          disabled={isSubmitting}
          required
        />
        {errors.subject && (
          <p id="subject-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message || ''}
          onChange={handleInputChange}
          rows={6}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.message ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Tell me about your project or opportunity..."
          aria-describedby={errors.message ? 'message-error' : undefined}
          disabled={isSubmitting}
          required
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Turnstile Widget */}
      <div>
        <Turnstile
          sitekey={siteKey}
          onVerify={handleTurnstileVerify}
          onExpire={handleTurnstileExpire}
          onError={() => {
            setErrors(prev => ({ ...prev, turnstileToken: 'Verification failed. Please try again.' }));
            trackTurnstileInteraction('error', 'verification_failed');
          }}
          theme="light"
          size="normal"
        />
        {errors.turnstileToken && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.turnstileToken}
          </p>
        )}
      </div>

      {/* Submit Status */}
      {submitStatus.type && (
        <div
          className={`p-4 rounded-md ${
            submitStatus.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
          role="alert"
          aria-live="polite"
        >
          {submitStatus.message}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !turnstileToken}
        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isSubmitting || !turnstileToken
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        aria-describedby={!turnstileToken ? 'turnstile-required' : undefined}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
      
      {!turnstileToken && (
        <p id="turnstile-required" className="text-sm text-gray-600 text-center">
          Please complete the security verification above
        </p>
      )}
    </form>
  );
} 