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

/**
 * Track an analytics event
 * @param event - The event to track
 */
export function trackEvent(event: AnalyticsEvent): void {
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