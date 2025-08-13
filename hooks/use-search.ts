'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { performFuzzySearch, getSearchSuggestions, SearchResult } from '@/lib/search/fuzzy-search';
import { 
  debounce, 
  trackSearchEvent, 
  validateSearchQuery,
  shouldPerformSearch,
  calculateSearchMetrics 
} from '@/lib/search/search-utils';

interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
  enableSuggestions?: boolean;
}

interface SearchState {
  query: string;
  results: SearchResult[];
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  searchTime: number;
  resultCount: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    maxResults = 20,
    enableSuggestions = true,
  } = options;

  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    suggestions: [],
    isLoading: false,
    error: null,
    hasSearched: false,
    searchTime: 0,
    resultCount: 0,
  });

  const lastQueryRef = useRef('');
  const lastSearchTimeRef = useRef(0);
  const searchStartTimeRef = useRef(0);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setState(prev => ({
          ...prev,
          results: [],
          suggestions: [],
          isLoading: false,
          hasSearched: false,
          searchTime: 0,
          resultCount: 0,
        }));
        return;
      }

      // Validate query
      const validation = validateSearchQuery(query);
      if (!validation.isValid) {
        setState(prev => ({
          ...prev,
          error: validation.error || 'Invalid search query',
          isLoading: false,
        }));
        return;
      }

      // Check if we should perform search
      if (!shouldPerformSearch(query, lastQueryRef.current, lastSearchTimeRef.current, minQueryLength)) {
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));
      searchStartTimeRef.current = Date.now();

      try {
        // Track search started
        trackSearchEvent('search_started', { query });

        // Perform search
        const results = await performFuzzySearch(query, {
          limit: maxResults,
        });

        // Get suggestions if enabled
        let suggestions: string[] = [];
        if (enableSuggestions && query.length >= 2) {
          suggestions = await getSearchSuggestions(query);
        }

        const searchTime = Date.now() - searchStartTimeRef.current;
        lastQueryRef.current = query;
        lastSearchTimeRef.current = Date.now();

        // Calculate metrics
        const metrics = calculateSearchMetrics(
          searchStartTimeRef.current,
          Date.now(),
          results.length,
          query.length
        );

        setState(prev => ({
          ...prev,
          results,
          suggestions,
          isLoading: false,
          hasSearched: true,
          searchTime: metrics.searchTime,
          resultCount: results.length,
        }));

        // Track search completed
        trackSearchEvent('search_completed', {
          query,
          resultCount: results.length,
          searchTime: metrics.searchTime,
        });

      } catch (error) {
        console.error('Search error:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Search failed',
          isLoading: false,
        }));
      }
    }, debounceMs),
    [debounceMs, minQueryLength, maxResults, enableSuggestions]
  );

  // Search function
  const search = useCallback(
    (query: string) => {
      setState(prev => ({ ...prev, query }));
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setState({
      query: '',
      results: [],
      suggestions: [],
      isLoading: false,
      error: null,
      hasSearched: false,
      searchTime: 0,
      resultCount: 0,
    });
    lastQueryRef.current = '';
  }, []);

  // Handle result click
  const handleResultClick = useCallback((result: SearchResult) => {
    trackSearchEvent('search_result_clicked', {
      query: state.query,
      resultType: result.type,
      resultId: result.id,
    });
  }, [state.query]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    trackSearchEvent('search_suggestion_clicked', {
      query: state.query,
      resultType: 'suggestion',
    });
    search(suggestion);
  }, [state.query, search]);

  // Filter results by type
  const filterByType = useCallback((type: SearchResult['type']) => {
    return state.results.filter(result => result.type === type);
  }, [state.results]);

  // Filter results by category
  const filterByCategory = useCallback((category: string) => {
    return state.results.filter(result => result.category === category);
  }, [state.results]);

  // Get unique categories from results
  const getUniqueCategories = useCallback(() => {
    const categories = new Set<string>();
    state.results.forEach(result => {
      if (result.category) {
        categories.add(result.category);
      }
    });
    return Array.from(categories);
  }, [state.results]);

  // Get unique types from results
  const getUniqueTypes = useCallback(() => {
    const types = new Set<SearchResult['type']>();
    state.results.forEach(result => {
      types.add(result.type);
    });
    return Array.from(types);
  }, [state.results]);

  // Check if search is empty
  const isEmpty = !state.query.trim();

  // Check if search has no results
  const hasNoResults = state.hasSearched && !state.isLoading && state.results.length === 0;

  // Check if search is ready (has results or has searched)
  const isReady = state.hasSearched || state.isLoading;

  return {
    // State
    query: state.query,
    results: state.results,
    suggestions: state.suggestions,
    isLoading: state.isLoading,
    error: state.error,
    hasSearched: state.hasSearched,
    searchTime: state.searchTime,
    resultCount: state.resultCount,

    // Actions
    search,
    clearSearch,
    handleResultClick,
    handleSuggestionClick,

    // Filters
    filterByType,
    filterByCategory,
    getUniqueCategories,
    getUniqueTypes,

    // Computed
    isEmpty,
    hasNoResults,
    isReady,
  };
} 