'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterState } from '../components/content/writing-filters';
import { createDefaultFilters, hasActiveFilters } from '../lib/filtering';
import { trackEvent } from '../lib/analytics';

/**
 * Custom hook for managing writing filters with URL state synchronization
 * @param initialWritings - Initial writings array for analytics
 * @returns Filter state and management functions
 */
export function useWritingFilters(initialWritings: any[] = []) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize filters from URL or defaults
  const [filters, setFilters] = useState<FilterState>(() => {
    const urlFilters = createDefaultFilters();
    
    // Read from URL params
    const platform = searchParams.get('platform') || '';
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const featured = searchParams.get('featured') === 'true';
    
    return {
      platform,
      category,
      search,
      featured
    };
  });

  // Update URL when filters change
  const updateURL = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();
    
    if (newFilters.platform) params.set('platform', newFilters.platform);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.featured) params.set('featured', 'true');
    
    const newURL = params.toString() ? `?${params.toString()}` : '/writing';
    router.replace(newURL, { scroll: false });
  }, [router]);

  // Update filters and URL
  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    updateURL(newFilters);
    
    // Track filter changes for analytics
    const activeFilters = Object.entries(newFilters).filter(([_, value]) => 
      value !== '' && value !== false
    );
    
    if (activeFilters.length > 0) {
      trackEvent({
        action: 'writing_filter_applied',
        category: 'writing',
        label: `Filters: ${activeFilters.map(([key]) => key).join(', ')}`,
        value: activeFilters.length
      });
    }
  }, [updateURL, initialWritings.length]);

  // Update a single filter
  const updateFilter = useCallback((key: keyof FilterState, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    updateFilters(newFilters);
  }, [filters, updateFilters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const emptyFilters = createDefaultFilters();
    setFilters(emptyFilters);
    updateURL(emptyFilters);
    
    // Track filter clear
    trackEvent({
      action: 'writing_filters_cleared',
      category: 'writing',
      label: 'All filters cleared'
    });
  }, [updateURL, initialWritings.length]);

  // Sync with URL changes (back/forward navigation)
  useEffect(() => {
    const platform = searchParams.get('platform') || '';
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const featured = searchParams.get('featured') === 'true';
    
    const urlFilters = { platform, category, search, featured };
    
    // Only update if different to avoid infinite loops
    if (JSON.stringify(urlFilters) !== JSON.stringify(filters)) {
      setFilters(urlFilters);
    }
  }, [searchParams, filters]);

  // Track initial page load with filters
  useEffect(() => {
    if (hasActiveFilters(filters)) {
      trackEvent({
        action: 'writing_page_loaded_with_filters',
        category: 'writing',
        label: `Initial filters: ${Object.entries(filters).filter(([_, value]) => 
          value !== '' && value !== false
        ).map(([key]) => key).join(', ')}`
      });
    }
  }, []); // Only run once on mount

  return {
    filters,
    updateFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters: hasActiveFilters(filters)
  };
} 