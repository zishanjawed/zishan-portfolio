import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SkeletonIframe } from '../ui/skeleton';
import { trackEvent } from '../../lib/analytics';

interface LazyIframeProps {
  src: string;
  title: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2';
  className?: string;
  allowFullScreen?: boolean;
  sandbox?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: (error: Error) => void;
  fallbackUrl?: string;
  analyticsCategory?: string;
}

export function LazyIframe({
  src,
  title,
  aspectRatio = '16/9',
  className = '',
  allowFullScreen = true,
  sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox',
  loading = 'lazy',
  onLoad,
  onError,
  fallbackUrl,
  analyticsCategory = 'iframe'
}: LazyIframeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the element is visible
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle iframe load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    
    // Track successful iframe load
    trackEvent({
      action: 'iframe_loaded',
      category: analyticsCategory,
      label: title
    });

    onLoad?.();
  }, [title, analyticsCategory, onLoad]);

  // Handle iframe error (for blocked iframes)
  const handleError = useCallback((error: Error) => {
    setHasError(true);
    setIsLoaded(false);
    
    // Track iframe error
    trackEvent({
      action: 'iframe_error',
      category: analyticsCategory,
      label: title
    });

    onError?.(error);
  }, [title, analyticsCategory, onError]);

  // Handle iframe error event
  const handleIframeError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
    
    // Track iframe error
    trackEvent({
      action: 'iframe_error',
      category: analyticsCategory,
      label: title
    });

    const error = new Error('Iframe failed to load');
    onError?.(error);
  }, [title, analyticsCategory, onError]);

  // Check if iframe is blocked
  useEffect(() => {
    if (isVisible && iframeRef.current) {
      try {
        // Try to access iframe content - if blocked, this will throw
        const iframe = iframeRef.current;
        const checkBlocked = () => {
          try {
            // This will throw if the iframe is blocked by CSP or other security measures
            if (iframe.contentWindow?.location) {
              setIsBlocked(false);
            }
          } catch (error) {
            setIsBlocked(true);
            handleError(new Error('Iframe blocked by security policy'));
          }
        };

        // Check after a short delay to allow for loading
        // Use a shorter timeout in test environment
        const timeout = process.env.NODE_ENV === 'test' ? 100 : 1000;
        const timeoutId = setTimeout(checkBlocked, timeout);
        return () => clearTimeout(timeoutId);
      } catch (error) {
        setIsBlocked(true);
        handleError(error as Error);
      }
    }
  }, [isVisible, handleError]);

  // Track iframe interaction
  const handleIframeInteraction = useCallback(() => {
    trackEvent({
      action: 'iframe_interaction',
      category: analyticsCategory,
      label: title
    });
  }, [title, analyticsCategory]);

  // Fallback content for blocked iframes
  const renderFallback = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="mb-4">
        <svg 
          className="w-12 h-12 text-gray-400 dark:text-gray-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Content Unavailable
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        This content cannot be displayed due to security restrictions.
      </p>
      {fallbackUrl && (
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          onClick={() => {
            trackEvent({
              action: 'fallback_link_click',
              category: analyticsCategory,
              label: title
            });
          }}
        >
          View Original Content
          <svg 
            className="ml-1 w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
            />
          </svg>
        </a>
      )}
    </div>
  );

  // Error content
  const renderError = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="mb-4">
        <svg 
          className="w-12 h-12 text-red-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Failed to Load Content
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        There was an error loading this content. Please try again later.
      </p>
      <button
        onClick={() => {
          setIsVisible(true);
          setHasError(false);
          setIsLoaded(false);
        }}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  const aspectRatioClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '3/2': 'aspect-[3/2]'
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${aspectRatioClasses[aspectRatio]} ${className}`}
      style={{ 
        // Ensure CLS-safe dimensions
        minHeight: aspectRatio === '16/9' ? '225px' : 
                   aspectRatio === '4/3' ? '300px' : 
                   aspectRatio === '1/1' ? '400px' : '300px'
      }}
    >
      {/* Loading skeleton */}
      {!isVisible && (
        <SkeletonIframe 
          aspectRatio={aspectRatio} 
          animated={true}
        />
      )}

      {/* Iframe content */}
      {isVisible && !hasError && !isBlocked && (
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen={allowFullScreen}
          sandbox={sandbox}
          loading={loading}
          onLoad={handleLoad}
          onError={handleIframeError}
          onFocus={handleIframeInteraction}
          onMouseEnter={handleIframeInteraction}
          aria-label={`Embedded content: ${title}`}
        />
      )}

      {/* Blocked iframe fallback */}
      {isVisible && isBlocked && renderFallback()}

      {/* Error state */}
      {isVisible && hasError && !isBlocked && renderError()}

      {/* Loading overlay */}
      {isVisible && !isLoaded && !hasError && !isBlocked && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Loading content...</span>
          </div>
        </div>
      )}
    </div>
  );
} 