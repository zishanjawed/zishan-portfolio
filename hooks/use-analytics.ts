'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  trackEvent, 
  trackPageView, 
  trackExternalLink, 
  trackContentView,
  trackProjectInteraction,
  trackWritingInteraction,
  trackSearch,
  trackFilter,
  trackPerformance,
  trackScrollDepth,
  trackAccessibility,
  trackPreference
} from '@/lib/analytics';

interface AnalyticsState {
  enabled: boolean;
  loaded: boolean;
}

export function useAnalytics() {
  const [state, setState] = useState<AnalyticsState>({
    enabled: true,
    loaded: false
  });

  useEffect(() => {
    // Check if analytics is enabled
    const checkAnalyticsStatus = () => {
      if (typeof window === 'undefined') return;
      
      const preference = localStorage.getItem('analytics-enabled');
      const enabled = preference === null || preference === 'true';
      
      // Check if Cloudflare Analytics is loaded
      const loaded = !!(window as any).cloudflare?.analytics;
      
      setState({ enabled, loaded });
    };

    checkAnalyticsStatus();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'analytics-enabled') {
        checkAnalyticsStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const enableAnalytics = useCallback(() => {
    localStorage.setItem('analytics-enabled', 'true');
    setState(prev => ({ ...prev, enabled: true }));
    trackPreference('analytics', true);
    window.location.reload();
  }, []);

  const disableAnalytics = useCallback(() => {
    localStorage.setItem('analytics-enabled', 'false');
    setState(prev => ({ ...prev, enabled: false }));
    trackPreference('analytics', false);
    window.location.reload();
  }, []);

  const trackCustomEvent = useCallback((event: {
    action: string;
    category: string;
    label?: string;
    value?: number;
  }) => {
    trackEvent(event);
  }, []);

  const trackPage = useCallback((path: string, title?: string) => {
    trackPageView(path, title);
  }, []);

  const trackLink = useCallback((url: string, title: string, source?: string) => {
    trackExternalLink(url, title, source);
  }, []);

  const trackContent = useCallback((title: string, type: string) => {
    trackContentView(title, type);
  }, []);

  const trackProject = useCallback((projectTitle: string, action: string) => {
    trackProjectInteraction(projectTitle, action);
  }, []);

  const trackWriting = useCallback((writingTitle: string, action: string) => {
    trackWritingInteraction(writingTitle, action);
  }, []);

  const trackSearchQuery = useCallback((query: string, results: number, category: string) => {
    trackSearch(query, results, category);
  }, []);

  const trackFilterChange = useCallback((
    filters: Array<{ key: string; value: string | boolean }>, 
    category: string, 
    totalResults: number
  ) => {
    trackFilter(filters, category, totalResults);
  }, []);

  const trackPerformanceMetric = useCallback((metric: string, value: number, category?: string) => {
    trackPerformance(metric, value, category);
  }, []);

  const trackScroll = useCallback((depth: number, page: string) => {
    trackScrollDepth(depth, page);
  }, []);

  const trackAccessibilityFeature = useCallback((feature: string, action: string) => {
    trackAccessibility(feature, action);
  }, []);

  const trackUserPreference = useCallback((preference: string, value: string | boolean) => {
    trackPreference(preference, value);
  }, []);

  return {
    // State
    analyticsEnabled: state.enabled,
    analyticsLoaded: state.loaded,
    
    // Controls
    enableAnalytics,
    disableAnalytics,
    
    // Tracking functions
    trackEvent: trackCustomEvent,
    trackPage,
    trackLink,
    trackContent,
    trackProject,
    trackWriting,
    trackSearch: trackSearchQuery,
    trackFilter: trackFilterChange,
    trackPerformance: trackPerformanceMetric,
    trackScroll,
    trackAccessibility: trackAccessibilityFeature,
    trackPreference: trackUserPreference,
  };
} 