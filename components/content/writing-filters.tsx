'use client';

import React, { useState, useEffect, useRef } from 'react';
import { WritingContent } from '../../types/writing';
import { cn } from '../../lib/utils/cn';
import { trackSearch, trackFilter } from '../../lib/analytics';

export interface FilterState {
  platform: string;
  category: string;
  search: string;
  featured: boolean;
}

interface WritingFiltersProps {
  writings: WritingContent[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
  totalResults?: number;
}

export function WritingFilters({ 
  writings, 
  filters, 
  onFiltersChange, 
  className = '',
  totalResults = 0
}: WritingFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Extract unique platforms and categories from writings
  const platforms = Array.from(new Set(writings.map(w => w.source).filter(Boolean)));
  const categories = Array.from(new Set(writings.flatMap(w => w.tags || [])));

  // Handle filter changes
  const updateFilter = (key: keyof FilterState, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);

    // Track filter change
    const filterArray = Object.entries(newFilters)
      .filter(([_, v]) => v !== '' && v !== false)
      .map(([k, v]) => ({ key: k, value: v }));
    trackFilter(filterArray, 'writing', totalResults);
  };

  // Handle search changes
  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value };
    onFiltersChange(newFilters);

    // Track search
    if (value.trim()) {
      trackSearch(value, totalResults, 'writing');
    }
  };

  // Clear all filters
  const clearFilters = () => {
    onFiltersChange({
      platform: '',
      category: '',
      search: '',
      featured: false
    });
    // Track filter clear
    trackFilter([], 'writing', totalResults);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.platform || filters.category || filters.search || filters.featured;

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);
      searchRef.current?.blur();
    }
  };

  // Focus search on '/' key
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className={cn('mb-8', className)}>
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="relative">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search articles... (Press '/' to focus)"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 pl-10 pr-12 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search articles"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {filters.search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="absolute top-full left-0 mt-1 text-xs text-gray-500 dark:text-gray-400">
          Press '/' to focus search
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Platform Filter */}
        <div className="relative">
          <select
            value={filters.platform}
            onChange={(e) => updateFilter('platform', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter by platform"
          >
            <option value="">All Platforms</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Filter */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.featured}
            onChange={(e) => updateFilter('featured', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            aria-label="Show featured articles only"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Featured Only</span>
        </label>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        )}

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          aria-expanded={isExpanded}
          aria-label="Toggle advanced filters"
        >
          {isExpanded ? 'Hide' : 'Show'} Advanced
          <svg 
            className={cn(
              'ml-1 h-4 w-4 inline transition-transform',
              isExpanded && 'rotate-180'
            )} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Advanced Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Read Time Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Read Time
              </label>
              <div className="flex space-x-2">
                {['5min', '10min', '15min', '20min+'].map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      // This would be implemented with actual read time filtering
                      console.log('Read time filter:', time);
                    }}
                    className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <div className="flex space-x-2">
                {['Last 30 days', 'Last 3 months', 'Last 6 months', 'Last year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      // This would be implemented with actual date filtering
                      console.log('Date range filter:', range);
                    }}
                    className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
          {filters.platform && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md">
              Platform: {filters.platform}
              <button
                onClick={() => updateFilter('platform', '')}
                className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                aria-label={`Remove platform filter: ${filters.platform}`}
              >
                ×
              </button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
              Category: {filters.category}
              <button
                onClick={() => updateFilter('category', '')}
                className="ml-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                aria-label={`Remove category filter: ${filters.category}`}
              >
                ×
              </button>
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md">
              Search: "{filters.search}"
              <button
                onClick={() => handleSearchChange('')}
                className="ml-1 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
                aria-label="Remove search filter"
              >
                ×
              </button>
            </span>
          )}
          {filters.featured && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-md">
              Featured Only
              <button
                onClick={() => updateFilter('featured', false)}
                className="ml-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                aria-label="Remove featured filter"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
} 