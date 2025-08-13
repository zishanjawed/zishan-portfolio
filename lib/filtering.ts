import { WritingContent } from '../types/writing';
import { FilterState } from '../components/content/writing-filters';

/**
 * Fuzzy search implementation for text matching
 * @param text - The text to search in
 * @param query - The search query
 * @returns true if the query matches the text
 */
function fuzzySearch(text: string, query: string): boolean {
  if (!query.trim()) return true;
  
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Simple fuzzy search - check if all query characters appear in order
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }
  
  return queryIndex === queryLower.length;
}

/**
 * Check if a writing item matches the search query
 * @param writing - The writing item to check
 * @param query - The search query
 * @returns true if the writing matches the search
 */
function matchesSearch(writing: WritingContent, query: string): boolean {
  if (!query.trim()) return true;
  
  const searchableText = [
    writing.title,
    writing.description,
    writing.author,
    writing.source,
    ...(writing.tags || [])
  ].join(' ').toLowerCase();
  
  return fuzzySearch(searchableText, query);
}

/**
 * Check if a writing item matches the platform filter
 * @param writing - The writing item to check
 * @param platform - The platform filter
 * @returns true if the writing matches the platform
 */
function matchesPlatform(writing: WritingContent, platform: string): boolean {
  if (!platform) return true;
  return writing.source?.toLowerCase() === platform.toLowerCase();
}

/**
 * Check if a writing item matches the category filter
 * @param writing - The writing item to check
 * @param category - The category filter
 * @returns true if the writing matches the category
 */
function matchesCategory(writing: WritingContent, category: string): boolean {
  if (!category) return true;
  return writing.tags?.some(tag => 
    tag.toLowerCase() === category.toLowerCase()
  ) || false;
}

/**
 * Check if a writing item matches the featured filter
 * @param writing - The writing item to check
 * @param featured - The featured filter
 * @returns true if the writing matches the featured filter
 */
function matchesFeatured(writing: WritingContent, featured: boolean): boolean {
  if (!featured) return true;
  return writing.featured === true;
}

/**
 * Filter writings based on the provided filter state
 * @param writings - Array of writing items to filter
 * @param filters - The filter state to apply
 * @returns Filtered array of writing items
 */
export function filterWritings(writings: WritingContent[], filters: FilterState): WritingContent[] {
  return writings.filter(writing => {
    return (
      matchesSearch(writing, filters.search) &&
      matchesPlatform(writing, filters.platform) &&
      matchesCategory(writing, filters.category) &&
      matchesFeatured(writing, filters.featured)
    );
  });
}

/**
 * Get unique platforms from writings
 * @param writings - Array of writing items
 * @returns Array of unique platform names
 */
export function getUniquePlatforms(writings: WritingContent[]): string[] {
  return Array.from(new Set(
    writings
      .map(w => w.source)
      .filter((source): source is string => Boolean(source))
      .sort()
  ));
}

/**
 * Get unique categories from writings
 * @param writings - Array of writing items
 * @returns Array of unique category names
 */
export function getUniqueCategories(writings: WritingContent[]): string[] {
  const allTags = writings.flatMap(w => w.tags || []);
  return Array.from(new Set(allTags)).sort();
}

/**
 * Get filter statistics for analytics
 * @param writings - Array of writing items
 * @param filters - The current filter state
 * @returns Object with filter statistics
 */
export function getFilterStats(writings: WritingContent[], filters: FilterState) {
  const totalWritings = writings.length;
  const filteredWritings = filterWritings(writings, filters);
  const activeFilters = Object.entries(filters).filter(([_, value]) => 
    value !== '' && value !== false
  ).length;
  
  return {
    total: totalWritings,
    filtered: filteredWritings.length,
    activeFilters,
    platforms: getUniquePlatforms(writings).length,
    categories: getUniqueCategories(writings).length,
    featured: writings.filter(w => w.featured).length
  };
}

/**
 * Create a default filter state
 * @returns Default filter state
 */
export function createDefaultFilters(): FilterState {
  return {
    platform: '',
    category: '',
    search: '',
    featured: false
  };
}

/**
 * Check if filters are active
 * @param filters - The filter state to check
 * @returns true if any filters are active
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return filters.platform !== '' || 
         filters.category !== '' || 
         filters.search !== '' || 
         filters.featured !== false;
}

/**
 * Clear all filters
 * @returns Empty filter state
 */
export function clearFilters(): FilterState {
  return createDefaultFilters();
} 