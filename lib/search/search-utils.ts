import { trackEvent } from '../analytics';

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Track search analytics
 */
export function trackSearchEvent(
  action: 'search_started' | 'search_completed' | 'search_result_clicked' | 'search_suggestion_clicked',
  data?: {
    query?: string;
    resultCount?: number;
    resultType?: string;
    resultId?: string;
    searchTime?: number;
  }
): void {
  trackEvent('search', {
    action,
    ...data,
  });
}

/**
 * Format search query for better matching
 */
export function formatSearchQuery(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[^\w\s-]/g, ''); // Remove special characters except hyphens
}

/**
 * Get search result type label
 */
export function getSearchResultTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    project: 'Project',
    writing: 'Article',
    experience: 'Experience',
    skill: 'Skill',
    person: 'Profile',
  };
  
  return labels[type] || type;
}

/**
 * Get search result type icon
 */
export function getSearchResultTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    project: '🚀',
    writing: '📝',
    experience: '💼',
    skill: '⚡',
    person: '👤',
  };
  
  return icons[type] || '📄';
}

/**
 * Format search result description for display
 */
export function formatSearchResultDescription(description: string, maxLength: number = 150): string {
  if (description.length <= maxLength) {
    return description;
  }
  
  // Try to break at a sentence boundary
  const truncated = description.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastPeriod > maxLength * 0.7) {
    return truncated.substring(0, lastPeriod + 1);
  }
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Group search results by type
 */
export function groupSearchResultsByType<T extends { type: string }>(results: T[]): Record<string, T[]> {
  return results.reduce((groups, result) => {
    const type = result.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(result);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Calculate search performance metrics
 */
export function calculateSearchMetrics(
  startTime: number,
  endTime: number,
  resultCount: number,
  queryLength: number
): {
  searchTime: number;
  resultsPerSecond: number;
  queryComplexity: number;
} {
  const searchTime = endTime - startTime;
  const resultsPerSecond = searchTime > 0 ? resultCount / (searchTime / 1000) : 0;
  const queryComplexity = Math.log(queryLength + 1); // Simple complexity metric
  
  return {
    searchTime,
    resultsPerSecond,
    queryComplexity,
  };
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: string): {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
} {
  const trimmed = query.trim();
  
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Search query cannot be empty',
    };
  }
  
  if (trimmed.length < 2) {
    return {
      isValid: false,
      error: 'Search query must be at least 2 characters long',
      suggestions: ['Try a longer search term'],
    };
  }
  
  if (trimmed.length > 100) {
    return {
      isValid: false,
      error: 'Search query is too long',
      suggestions: ['Try a shorter, more specific search term'],
    };
  }
  
  // Check for excessive special characters
  const specialCharRatio = (trimmed.match(/[^\w\s]/g) || []).length / trimmed.length;
  if (specialCharRatio > 0.5) {
    return {
      isValid: false,
      error: 'Search query contains too many special characters',
      suggestions: ['Try using mostly letters and numbers'],
    };
  }
  
  return { isValid: true };
}

/**
 * Create search URL with query parameters
 */
export function createSearchURL(query: string, filters?: Record<string, string>): string {
  const params = new URLSearchParams();
  params.set('q', query);
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
  }
  
  return `/?${params.toString()}#search`;
}

/**
 * Parse search URL parameters
 */
export function parseSearchURL(url: string): {
  query: string;
  filters: Record<string, string>;
} {
  try {
    const urlObj = new URL(url, window.location.origin);
    const query = urlObj.searchParams.get('q') || '';
    const filters: Record<string, string> = {};
    
    // Extract filter parameters
    ['type', 'category'].forEach(key => {
      const value = urlObj.searchParams.get(key);
      if (value) {
        filters[key] = value;
      }
    });
    
    return { query, filters };
  } catch {
    return { query: '', filters: {} };
  }
}

/**
 * Get search keyboard shortcuts help text
 */
export function getSearchKeyboardShortcuts(): Array<{
  key: string;
  description: string;
}> {
  return [
    { key: '/', description: 'Open search' },
    { key: '↑↓', description: 'Navigate results' },
    { key: 'Enter', description: 'Select result' },
    { key: 'Escape', description: 'Close search' },
    { key: 'Cmd/Ctrl + K', description: 'Alternative search shortcut' },
  ];
}

/**
 * Check if search should be performed (based on query and timing)
 */
export function shouldPerformSearch(
  query: string,
  lastQuery: string,
  lastSearchTime: number,
  minQueryLength: number = 2,
  minTimeBetweenSearches: number = 300
): boolean {
  const now = Date.now();
  const timeSinceLastSearch = now - lastSearchTime;
  
  // Don't search if query is too short
  if (query.length < minQueryLength) {
    return false;
  }
  
  // Don't search if too little time has passed
  if (timeSinceLastSearch < minTimeBetweenSearches) {
    return false;
  }
  
  // Don't search if query hasn't changed
  if (query === lastQuery) {
    return false;
  }
  
  return true;
} 