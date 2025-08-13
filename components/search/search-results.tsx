'use client';

import React from 'react';
import { SearchResult } from '@/lib/search/fuzzy-search';
import { 
  getSearchResultTypeLabel, 
  getSearchResultTypeIcon,
  formatSearchResultDescription,
  groupSearchResultsByType 
} from '@/lib/search/search-utils';
import { cn } from '@/lib/utils/cn';

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
  selectedIndex?: number;
  onResultSelect?: (index: number) => void;
  showCategories?: boolean;
  maxResults?: number;
}

export function SearchResults({
  results,
  onResultClick,
  selectedIndex = -1,
  onResultSelect,
  showCategories = true,
  maxResults = 20,
}: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  const limitedResults = results.slice(0, maxResults);
  const groupedResults = showCategories ? groupSearchResultsByType(limitedResults) : { all: limitedResults };

  return (
    <div className="space-y-4">
      {Object.entries(groupedResults).map(([category, categoryResults]) => (
        <div key={category} className="space-y-2">
          {showCategories && category !== 'all' && (
            <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-md">
              {getSearchResultTypeLabel(category)} ({categoryResults.length})
            </div>
          )}
          <div className="space-y-1">
            {categoryResults.map((result, index) => {
              const globalIndex = results.indexOf(result);
              const isSelected = globalIndex === selectedIndex;
              
              return (
                <SearchResultItem
                  key={`${result.type}-${result.id}`}
                  result={result}
                  isSelected={isSelected}
                  onClick={() => onResultClick(result)}
                  onSelect={() => onResultSelect?.(globalIndex)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

interface SearchResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
  onSelect?: () => void;
}

function SearchResultItem({ result, isSelected, onClick, onSelect }: SearchResultItemProps) {
  const typeLabel = getSearchResultTypeLabel(result.type);
  const typeIcon = getSearchResultTypeIcon(result.type);
  const description = formatSearchResultDescription(result.description);

  const handleClick = () => {
    onSelect?.();
    onClick();
  };

  const handleMouseEnter = () => {
    onSelect?.();
  };

  return (
    <div
      className={cn(
        "px-4 py-3 cursor-pointer rounded-md transition-colors",
        "hover:bg-gray-50 dark:hover:bg-gray-800",
        isSelected && "bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500"
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
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
          
          {/* Tags */}
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
          
          {/* Technologies */}
          {result.technologies && result.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {result.technologies.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  {tech.name}
                </span>
              ))}
              {result.technologies.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{result.technologies.length - 3} more
                </span>
              )}
            </div>
          )}
          
          {/* Metadata */}
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
            {result.metadata?.publishedDate && (
              <span>
                {new Date(result.metadata.publishedDate).toLocaleDateString()}
              </span>
            )}
            {result.metadata?.readTime && (
              <span>{result.metadata.readTime} min read</span>
            )}
            {result.metadata?.client && (
              <span>Client: {result.metadata.client}</span>
            )}
            {result.metadata?.role && (
              <span>Role: {result.metadata.role}</span>
            )}
            {result.relevance > 0 && (
              <span className="text-green-600 dark:text-green-400">
                {Math.round(result.relevance * 100)}% match
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Highlighted text component for search result highlights
interface HighlightedTextProps {
  text: string;
  highlights?: string[];
  className?: string;
}

export function HighlightedText({ text, highlights, className }: HighlightedTextProps) {
  if (!highlights || highlights.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ 
        __html: highlights.join('') 
      }} 
    />
  );
} 