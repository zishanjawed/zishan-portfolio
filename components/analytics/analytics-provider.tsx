'use client';

import { useEffect, useState, useCallback } from 'react';
import { trackEvent } from '@/lib/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

interface CloudflareAnalytics {
  track: (event: string, data?: Record<string, any>) => void;
}

declare global {
  interface Window {
    cloudflare?: {
      analytics?: CloudflareAnalytics;
    };
  }
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  // Memoized function to check user preference
  const checkUserPreference = useCallback(() => {
    if (typeof window === 'undefined') return true;
    const userPreference = localStorage.getItem('analytics-enabled');
    return userPreference === null || userPreference === 'true';
  }, []);

  // Memoized function to load analytics
  const loadAnalytics = useCallback(async () => {
    try {
      const token = process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;
      
      if (!token || token === 'CHANGE_ME_TO_YOUR_CLOUDFLARE_ANALYTICS_TOKEN') {
        console.warn('Cloudflare Analytics token not configured');
        setAnalyticsError('Token not configured');
        return;
      }

      // Check if script is already loaded
      if (document.querySelector('script[data-cf-analytics]')) {
        setAnalyticsLoaded(true);
        return;
      }

      // Create and inject the Cloudflare Analytics script
      const script = document.createElement('script');
      script.setAttribute('data-cf-analytics', 'true');
      script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
      script.setAttribute('data-cf-beacon', JSON.stringify({
        token: token,
        spa: true, // Enable SPA tracking
        debug: process.env.NODE_ENV === 'development'
      }));
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setAnalyticsLoaded(true);
        setAnalyticsError(null);
        trackEvent({
          action: 'analytics_loaded',
          category: 'analytics',
          label: 'cloudflare_analytics_loaded'
        });
      };

      script.onerror = () => {
        console.warn('Failed to load Cloudflare Analytics');
        setAnalyticsError('Script load failed');
        trackEvent({
          action: 'analytics_load_error',
          category: 'analytics',
          label: 'cloudflare_analytics_load_failed'
        });
      };

      document.head.appendChild(script);
    } catch (error) {
      console.warn('Error loading Cloudflare Analytics:', error);
      setAnalyticsError(error instanceof Error ? error.message : 'Unknown error');
      trackEvent({
        action: 'analytics_error',
        category: 'analytics',
        label: 'cloudflare_analytics_error'
      });
    }
  }, []);

  // Initialize analytics based on user preference
  useEffect(() => {
    const enabled = checkUserPreference();
    setAnalyticsEnabled(enabled);

    if (enabled) {
      loadAnalytics();
    }
  }, [checkUserPreference, loadAnalytics]);

  // Track page views when analytics is loaded
  useEffect(() => {
    if (analyticsLoaded && analyticsEnabled && typeof window !== 'undefined') {
      trackEvent({
        action: 'page_view',
        category: 'navigation',
        label: window.location.pathname
      });
    }
  }, [analyticsLoaded, analyticsEnabled]);

  // Expose analytics control functions to window for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).analytics = {
        track: trackEvent,
        enable: () => {
          setAnalyticsEnabled(true);
          localStorage.setItem('analytics-enabled', 'true');
          if (!analyticsLoaded) {
            loadAnalytics();
          }
        },
        disable: () => {
          setAnalyticsEnabled(false);
          localStorage.setItem('analytics-enabled', 'false');
        },
        status: () => ({
          loaded: analyticsLoaded,
          enabled: analyticsEnabled,
          error: analyticsError
        })
      };
    }
  }, [analyticsLoaded, analyticsEnabled, analyticsError, loadAnalytics]);

  return <>{children}</>;
} 