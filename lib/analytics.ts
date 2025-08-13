/**
 * Analytics utility for tracking user interactions
 * Uses Cloudflare Web Analytics when available, falls back to console logging
 */

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface FilterEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  filters?: Array<{ key: string; value: string | boolean }>;
  total_writings?: number;
}

/**
 * Track an analytics event
 * @param event - The event to track
 */
export function trackEvent(event: AnalyticsEvent | FilterEvent): void {
  try {
    // Check if Cloudflare Web Analytics is available
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'custom_event',
        ...event
      });
    } else if (typeof window !== 'undefined' && (window as any).gtag) {
      // Google Analytics fallback
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    } else {
      // Console fallback for development
      console.log('Analytics Event:', event);
    }
  } catch (error) {
    // Silently fail in case of analytics errors
    console.warn('Analytics tracking failed:', error);
  }
}

/**
 * Track external link clicks
 * @param url - The URL that was clicked
 * @param title - The title of the content
 * @param source - The source/platform of the content
 */
export function trackExternalLink(url: string, title: string, source?: string): void {
  trackEvent({
    action: 'click_external_link',
    category: 'engagement',
    label: `${title} (${source || 'unknown'})`,
  });
}

/**
 * Track content view
 * @param title - The title of the content
 * @param type - The type of content
 */
export function trackContentView(title: string, type: string): void {
  trackEvent({
    action: 'view_content',
    category: 'engagement',
    label: `${title} (${type})`,
  });
}

/**
 * Track iframe load
 * @param title - The title of the iframe content
 * @param source - The source URL of the iframe
 */
export function trackIframeLoad(title: string, source: string): void {
  trackEvent({
    action: 'iframe_loaded',
    category: 'iframe',
    label: `${title} (${source})`,
  });
}

/**
 * Track iframe error
 * @param title - The title of the iframe content
 * @param error - The error message
 */
export function trackIframeError(title: string, error: string): void {
  trackEvent({
    action: 'iframe_error',
    category: 'iframe',
    label: `${title} (${error})`,
  });
}

/**
 * Track iframe interaction
 * @param title - The title of the iframe content
 * @param interactionType - The type of interaction
 */
export function trackIframeInteraction(title: string, interactionType: string): void {
  trackEvent({
    action: 'iframe_interaction',
    category: 'iframe',
    label: `${title} (${interactionType})`,
  });
}

/**
 * Track form interaction
 * @param formName - The name of the form
 * @param action - The action performed (start, submit, success, error)
 * @param details - Additional details about the interaction
 */
export function trackFormInteraction(formName: string, action: string, details?: string): void {
  trackEvent({
    action: `form_${action}`,
    category: 'form',
    label: `${formName}${details ? ` (${details})` : ''}`,
  });
}

/**
 * Track Turnstile interaction
 * @param action - The action performed (verify, success, error, expire)
 * @param details - Additional details about the interaction
 */
export function trackTurnstileInteraction(action: string, details?: string): void {
  trackEvent({
    action: `turnstile_${action}`,
    category: 'security',
    label: details || action,
  });
}

/**
 * Track contact form submission
 * @param success - Whether the submission was successful
 * @param errorType - Type of error if submission failed
 */
export function trackContactSubmission(success: boolean, errorType?: string): void {
  trackEvent({
    action: success ? 'contact_form_success' : 'contact_form_error',
    category: 'contact',
    label: errorType || (success ? 'success' : 'error'),
  });
} 