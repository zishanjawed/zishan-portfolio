'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface AnalyticsOptOutProps {
  className?: string;
}

export function AnalyticsOptOut({ className = '' }: AnalyticsOptOutProps) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Load user preference from localStorage
    const userPreference = localStorage.getItem('analytics-enabled');
    if (userPreference !== null) {
      setAnalyticsEnabled(userPreference === 'true');
    }
  }, []);

  const handleToggleAnalytics = (enabled: boolean) => {
    setAnalyticsEnabled(enabled);
    localStorage.setItem('analytics-enabled', enabled.toString());
    
    // Track the preference change
    trackEvent({
      action: enabled ? 'analytics_enabled' : 'analytics_disabled',
      category: 'privacy',
      label: 'user_preference_change'
    });

    // Reload the page to apply changes
    window.location.reload();
  };

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <input
              id="analytics-toggle"
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => handleToggleAnalytics(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="analytics-toggle" className="ml-2 text-sm font-medium text-gray-700">
              Enable Analytics
            </label>
          </div>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {showDetails ? 'Hide Details' : 'Privacy Details'}
        </button>
      </div>

      {showDetails && (
        <div className="mt-4 text-sm text-gray-600 space-y-2">
          <p>
            <strong>What we track:</strong> Page views, user interactions, and performance metrics to improve your experience.
          </p>
          <p>
            <strong>Privacy-first:</strong> We use Cloudflare Web Analytics which doesn't use cookies and respects your privacy.
          </p>
          <p>
            <strong>Your control:</strong> You can disable analytics at any time. Your preference is saved locally.
          </p>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800 text-xs">
              <strong>Note:</strong> Disabling analytics may affect our ability to improve the site based on user behavior.
            </p>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        {analyticsEnabled ? (
          <span className="text-green-600">✓ Analytics enabled</span>
        ) : (
          <span className="text-red-600">✗ Analytics disabled</span>
        )}
      </div>
    </div>
  );
} 