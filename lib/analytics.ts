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

interface PerformanceEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  metric?: string;
  duration?: number;
}

type AnalyticsEventType = AnalyticsEvent | FilterEvent | PerformanceEvent;

/**
 * Check if analytics is enabled by user preference
 */
function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const preference = localStorage.getItem('analytics-enabled');
    return preference === null || preference === 'true';
  } catch (error) {
    console.warn('Failed to check analytics preference:', error);
    return false;
  }
}

/**
 * Get the appropriate analytics provider
 */
function getAnalyticsProvider(): 'cloudflare' | 'gtag' | 'dataLayer' | 'console' {
  if (typeof window === 'undefined') return 'console';
  
  if ((window as any).cloudflare?.analytics) {
    return 'cloudflare';
  } else if ((window as any).gtag) {
    return 'gtag';
  } else if ((window as any).dataLayer) {
    return 'dataLayer';
  }
  
  return 'console';
}

/**
 * Track an analytics event with improved error handling and performance
 */
export function trackEvent(event: AnalyticsEventType): void {
  try {
    if (!isAnalyticsEnabled()) {
      return;
    }

    const provider = getAnalyticsProvider();
    
    switch (provider) {
      case 'cloudflare':
        (window as any).cloudflare.analytics.track('custom_event', {
          action: event.action,
          category: event.category,
          label: event.label,
          value: event.value,
          ...event
        });
        break;
        
      case 'dataLayer':
        (window as any).dataLayer.push({
          event: 'custom_event',
          ...event
        });
        break;
        
      case 'gtag':
        (window as any).gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value
        });
        break;
        
      case 'console':
      default:
        if (process.env.NODE_ENV === 'development') {
          console.log('Analytics Event:', event);
        }
        break;
    }
  } catch (error) {
    // Log error but don't break the application
    console.warn('Analytics tracking failed:', error);
    
    // Fallback to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event (fallback):', event);
    }
  }
}

/**
 * Track page view with validation
 */
export function trackPageView(path: string, title?: string): void {
  if (!path) {
    console.warn('trackPageView: path is required');
    return;
  }
  
  trackEvent({
    action: 'page_view',
    category: 'navigation',
    label: title || path,
  });
}

/**
 * Track external link clicks with URL validation
 */
export function trackExternalLink(url: string, title: string, source?: string): void {
  if (!url || !title) {
    console.warn('trackExternalLink: url and title are required');
    return;
  }
  
  trackEvent({
    action: 'click_external_link',
    category: 'engagement',
    label: `${title} (${source || 'unknown'})`,
  });
}

/**
 * Track content view with validation
 */
export function trackContentView(title: string, type: string): void {
  if (!title || !type) {
    console.warn('trackContentView: title and type are required');
    return;
  }
  
  trackEvent({
    action: 'view_content',
    category: 'engagement',
    label: `${title} (${type})`,
  });
}

/**
 * Track iframe load with validation
 */
export function trackIframeLoad(title: string, source: string): void {
  if (!title || !source) {
    console.warn('trackIframeLoad: title and source are required');
    return;
  }
  
  trackEvent({
    action: 'iframe_loaded',
    category: 'iframe',
    label: `${title} (${source})`,
  });
}

/**
 * Track iframe error with validation
 */
export function trackIframeError(title: string, error: string): void {
  if (!title || !error) {
    console.warn('trackIframeError: title and error are required');
    return;
  }
  
  trackEvent({
    action: 'iframe_error',
    category: 'iframe',
    label: `${title} (${error})`,
  });
}

/**
 * Track iframe interaction with validation
 */
export function trackIframeInteraction(title: string, interactionType: string): void {
  if (!title || !interactionType) {
    console.warn('trackIframeInteraction: title and interactionType are required');
    return;
  }
  
  trackEvent({
    action: 'iframe_interaction',
    category: 'iframe',
    label: `${title} (${interactionType})`,
  });
}

/**
 * Track form interaction with validation
 */
export function trackFormInteraction(formName: string, action: string, details?: string): void {
  if (!formName || !action) {
    console.warn('trackFormInteraction: formName and action are required');
    return;
  }
  
  trackEvent({
    action: `form_${action}`,
    category: 'form',
    label: `${formName}${details ? ` (${details})` : ''}`,
  });
}

/**
 * Track Turnstile interaction with validation
 */
export function trackTurnstileInteraction(action: string, details?: string): void {
  if (!action) {
    console.warn('trackTurnstileInteraction: action is required');
    return;
  }
  
  trackEvent({
    action: `turnstile_${action}`,
    category: 'security',
    label: details || action,
  });
}

/**
 * Track contact form submission with validation
 */
export function trackContactSubmission(success: boolean, errorType?: string): void {
  trackEvent({
    action: success ? 'contact_form_success' : 'contact_form_error',
    category: 'contact',
    label: errorType || (success ? 'success' : 'error'),
  });
}

/**
 * Track project interaction with validation
 */
export function trackProjectInteraction(projectTitle: string, action: string): void {
  if (!projectTitle || !action) {
    console.warn('trackProjectInteraction: projectTitle and action are required');
    return;
  }
  
  trackEvent({
    action: `project_${action}`,
    category: 'project',
    label: projectTitle,
  });
}

/**
 * Track writing interaction with validation
 */
export function trackWritingInteraction(writingTitle: string, action: string): void {
  if (!writingTitle || !action) {
    console.warn('trackWritingInteraction: writingTitle and action are required');
    return;
  }
  
  trackEvent({
    action: `writing_${action}`,
    category: 'writing',
    label: writingTitle,
  });
}

/**
 * Track search interaction with validation
 */
export function trackSearch(query: string, results: number, category: string): void {
  if (!query || !category) {
    console.warn('trackSearch: query and category are required');
    return;
  }
  
  trackEvent({
    action: 'search',
    category: 'search',
    label: `${category}: ${query}`,
    value: results,
  });
}

/**
 * Track filter interaction with validation
 */
export function trackFilter(filters: Array<{ key: string; value: string | boolean }>, category: string, totalResults: number): void {
  if (!filters || !category) {
    console.warn('trackFilter: filters and category are required');
    return;
  }
  
  trackEvent({
    action: 'filter',
    category: 'filter',
    label: `${category}: ${filters.map(f => `${f.key}=${f.value}`).join(', ')}`,
    value: totalResults,
  } as FilterEvent);
}

/**
 * Track performance metric with validation
 */
export function trackPerformance(metric: string, value: number, category: string = 'performance'): void {
  if (!metric || typeof value !== 'number') {
    console.warn('trackPerformance: metric and numeric value are required');
    return;
  }
  
  trackEvent({
    action: 'performance_metric',
    category,
    label: metric,
    value,
    metric,
  } as PerformanceEvent);
}

/**
 * Track scroll depth with validation
 */
export function trackScrollDepth(depth: number, page: string): void {
  if (typeof depth !== 'number' || depth < 0 || depth > 100 || !page) {
    console.warn('trackScrollDepth: depth must be 0-100 and page is required');
    return;
  }
  
  trackEvent({
    action: 'scroll_depth',
    category: 'engagement',
    label: page,
    value: depth,
  });
}

/**
 * Track accessibility feature usage with validation
 */
export function trackAccessibility(feature: string, action: string): void {
  if (!feature || !action) {
    console.warn('trackAccessibility: feature and action are required');
    return;
  }
  
  trackEvent({
    action: `accessibility_${action}`,
    category: 'accessibility',
    label: feature,
  });
}

/**
 * Track user preference change with validation
 */
export function trackPreference(preference: string, value: string | boolean): void {
  if (!preference) {
    console.warn('trackPreference: preference is required');
    return;
  }
  
  trackEvent({
    action: 'preference_change',
    category: 'user_preferences',
    label: `${preference}: ${value}`,
  });
} 