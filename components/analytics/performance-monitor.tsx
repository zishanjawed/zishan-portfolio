'use client';

import { useEffect, useRef } from 'react';
import { trackPerformance, trackEvent } from '@/lib/analytics';

interface PerformanceMonitorProps {
  pageName?: string;
}

export function PerformanceMonitor({ pageName = 'unknown' }: PerformanceMonitorProps) {
  const cleanupRefs = useRef<Array<() => void>>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals
    const trackCoreWebVitals = () => {
      // Track Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as PerformanceEntry;
            
            trackPerformance('LCP', lastEntry.startTime, 'core_web_vitals');
            
            // Track LCP element
            if ('element' in lastEntry && lastEntry.element) {
              const element = lastEntry.element as Element;
              trackEvent({
                action: 'lcp_element',
                category: 'performance',
                label: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${element.className ? `.${element.className.split(' ')[0]}` : ''}`,
                value: Math.round(lastEntry.startTime)
              });
            }
          });
          
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          cleanupRefs.current.push(() => lcpObserver.disconnect());
        } catch (e) {
          console.warn('LCP observer not supported:', e);
        }
      }

      // Track First Input Delay (FID)
      if ('PerformanceObserver' in window) {
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              trackPerformance('FID', entry.processingStart - entry.startTime, 'core_web_vitals');
            });
          });
          
          fidObserver.observe({ entryTypes: ['first-input'] });
          cleanupRefs.current.push(() => fidObserver.disconnect());
        } catch (e) {
          console.warn('FID observer not supported:', e);
        }
      }

      // Track Cumulative Layout Shift (CLS)
      if ('PerformanceObserver' in window) {
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
          });
          
          clsObserver.observe({ entryTypes: ['layout-shift'] });
          cleanupRefs.current.push(() => clsObserver.disconnect());

          // Report CLS on page unload
          const handleBeforeUnload = () => {
            trackPerformance('CLS', clsValue, 'core_web_vitals');
          };
          
          window.addEventListener('beforeunload', handleBeforeUnload);
          cleanupRefs.current.push(() => window.removeEventListener('beforeunload', handleBeforeUnload));
        } catch (e) {
          console.warn('CLS observer not supported:', e);
        }
      }
    };

    // Track page load performance
    const trackPageLoadPerformance = () => {
      if ('performance' in window) {
        try {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          if (navigation) {
            // Track key performance metrics
            trackPerformance('DOMContentLoaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'page_load');
            trackPerformance('LoadComplete', navigation.loadEventEnd - navigation.loadEventStart, 'page_load');
            trackPerformance('FirstPaint', navigation.responseEnd - navigation.fetchStart, 'page_load');
            
            // Track resource loading
            const resources = performance.getEntriesByType('resource');
            resources.forEach((resource) => {
              if (resource.initiatorType === 'img' || resource.initiatorType === 'script' || resource.initiatorType === 'css') {
                trackPerformance(`${resource.initiatorType}_load`, resource.duration, 'resource_loading');
              }
            });
          }
        } catch (e) {
          console.warn('Page load performance tracking failed:', e);
        }
      }
    };

    // Track scroll performance
    const trackScrollPerformance = () => {
      let scrollTimeout: NodeJS.Timeout;
      let maxScrollDepth = 0;
      
      const handleScroll = () => {
        clearTimeout(scrollTimeout);
        
        const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth;
        }
        
        scrollTimeout = setTimeout(() => {
          trackEvent({
            action: 'scroll_depth',
            category: 'engagement',
            label: pageName,
            value: maxScrollDepth
          });
        }, 1000);
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
      };
    };

    // Track memory usage (if available)
    const trackMemoryUsage = () => {
      if ('memory' in performance) {
        try {
          const memory = (performance as any).memory;
          trackPerformance('memory_used', memory.usedJSHeapSize / 1024 / 1024, 'memory'); // MB
          trackPerformance('memory_limit', memory.jsHeapSizeLimit / 1024 / 1024, 'memory'); // MB
        } catch (e) {
          console.warn('Memory tracking failed:', e);
        }
      }
    };

    // Initialize all tracking
    trackCoreWebVitals();
    trackPageLoadPerformance();
    const cleanupScroll = trackScrollPerformance();
    cleanupRefs.current.push(cleanupScroll);
    
    // Track memory usage periodically
    const memoryInterval = setInterval(trackMemoryUsage, 30000); // Every 30 seconds
    cleanupRefs.current.push(() => clearInterval(memoryInterval));
    
    // Track page visibility changes
    const handleVisibilityChange = () => {
      trackEvent({
        action: 'page_visibility',
        category: 'engagement',
        label: document.hidden ? 'hidden' : 'visible'
      });
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    cleanupRefs.current.push(() => document.removeEventListener('visibilitychange', handleVisibilityChange));
    
    // Track network status
    const handleOnline = () => {
      trackEvent({
        action: 'network_status',
        category: 'performance',
        label: 'online'
      });
    };
    
    const handleOffline = () => {
      trackEvent({
        action: 'network_status',
        category: 'performance',
        label: 'offline'
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    cleanupRefs.current.push(() => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    });

    // Cleanup function
    return () => {
      cleanupRefs.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (e) {
          console.warn('Cleanup failed:', e);
        }
      });
      cleanupRefs.current = [];
    };
  }, [pageName]);

  return null; // This component doesn't render anything
} 