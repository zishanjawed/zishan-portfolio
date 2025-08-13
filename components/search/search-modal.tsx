'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Search, ArrowUp, ArrowDown, Command } from 'lucide-react';
import { useSearch } from '@/hooks/use-search';
import { SearchResult } from '@/lib/search/fuzzy-search';
import { 
  getSearchResultTypeLabel, 
  getSearchResultTypeIcon,
  formatSearchResultDescription,
  getSearchKeyboardShortcuts 
} from '@/lib/search/search-utils';
import { cn } from '@/lib/utils/cn';

interface SearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuery?: string;
}

export function SearchModal({ isOpen, onOpenChange, initialQuery = '' }: SearchModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const selectedResultRef = useRef<HTMLDivElement>(null);

  const {
    query,
    results,
    suggestions,
    isLoading,
    error,
    hasSearched,
    searchTime,
    resultCount,
    search,
    clearSearch,
    handleResultClick,
    handleSuggestionClick,
    isEmpty,
    hasNoResults,
  } = useSearch({
    debounceMs: 300,
    minQueryLength: 2,
    maxResults: 20,
    enableSuggestions: true,
  });

  // Initialize with initial query
  useEffect(() => {
    if (isOpen && initialQuery) {
      search(initialQuery);
    }
  }, [isOpen, initialQuery, search]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Scroll selected result into view
  useEffect(() => {
    if (selectedResultRef.current) {
      selectedResultRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const totalItems = results.length + suggestions.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex < results.length) {
          const result = results[selectedIndex];
          handleResultClick(result);
          if (result.url) {
            window.location.href = result.url;
          }
          onOpenChange(false);
        } else if (selectedIndex < totalItems) {
          const suggestionIndex = selectedIndex - results.length;
          const suggestion = suggestions[suggestionIndex];
          handleSuggestionClick(suggestion);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onOpenChange(false);
        break;
      case 'k':
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          // Keep modal open, just focus input
          inputRef.current?.focus();
        }
        break;
    }
  }, [results, suggestions, selectedIndex, handleResultClick, handleSuggestionClick, onOpenChange]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    search(value);
  };

  // Handle result click
  const handleResultSelect = (result: SearchResult) => {
    handleResultClick(result);
    if (result.url) {
      window.location.href = result.url;
    }
    onOpenChange(false);
  };

  // Handle suggestion click
  const handleSuggestionSelect = (suggestion: string) => {
    handleSuggestionClick(suggestion);
  };

  // Get all items for navigation (results + suggestions)
  const allItems = [...results, ...suggestions.map(s => ({ type: 'suggestion' as const, title: s }))];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search projects, articles, skills..."
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-lg placeholder-gray-500 dark:placeholder-gray-400"
                  aria-label="Search"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowShortcuts(!showShortcuts)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Show keyboard shortcuts"
                >
                  <Command className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Keyboard shortcuts help */}
            {showShortcuts && (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {getSearchKeyboardShortcuts().map((shortcut) => (
                    <div key={shortcut.key} className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{shortcut.description}</span>
                      <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            <div 
              ref={resultsRef}
              className="max-h-96 overflow-y-auto"
            >
              {isLoading && (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500 mx-auto mb-2"></div>
                  Searching...
                </div>
              )}

              {error && (
                <div className="p-4 text-center text-red-500">
                  {error}
                </div>
              )}

              {!isLoading && !error && isEmpty && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Search anything</p>
                  <p className="text-sm">Search through projects, articles, skills, and experience</p>
                </div>
              )}

              {!isLoading && !error && hasNoResults && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No results found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}

              {!isLoading && !error && results.length > 0 && (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {results.map((result, index) => (
                    <SearchResultItem
                      key={`${result.type}-${result.id}`}
                      result={result}
                      isSelected={index === selectedIndex}
                      onClick={() => handleResultSelect(result)}
                      ref={index === selectedIndex ? selectedResultRef : undefined}
                    />
                  ))}
                </div>
              )}

              {!isLoading && !error && suggestions.length > 0 && results.length === 0 && (
                <div>
                  <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                    Suggestions
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={suggestion}
                        ref={results.length + index === selectedIndex ? selectedResultRef : undefined}
                        className={cn(
                          "px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
                          results.length + index === selectedIndex && "bg-blue-50 dark:bg-blue-900/20"
                        )}
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        <div className="flex items-center space-x-3">
                          <Search className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {hasSearched && !isLoading && !error && (
              <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                {resultCount > 0 ? (
                  <span>
                    {resultCount} result{resultCount !== 1 ? 's' : ''} 
                    {searchTime > 0 && ` in ${searchTime}ms`}
                  </span>
                ) : (
                  <span>No results found</span>
                )}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Search result item component
const SearchResultItem = React.forwardRef<
  HTMLDivElement,
  {
    result: SearchResult;
    isSelected: boolean;
    onClick: () => void;
  }
>(({ result, isSelected, onClick }, ref) => {
  const typeLabel = getSearchResultTypeLabel(result.type);
  const typeIcon = getSearchResultTypeIcon(result.type);
  const description = formatSearchResultDescription(result.description);

  return (
    <div
      ref={ref}
      className={cn(
        "px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
        isSelected && "bg-blue-50 dark:bg-blue-900/20"
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-lg">
          {typeIcon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {result.title}
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {typeLabel}
            </span>
            {result.category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {result.category}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
          {result.tags && result.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {result.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
              {result.tags.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{result.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <ArrowUp className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
});

SearchResultItem.displayName = 'SearchResultItem'; 