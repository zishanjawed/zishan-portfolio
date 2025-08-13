import React, { useState } from 'react';
import Image from 'next/image';
import { WritingContent } from '../../types/writing';
import { trackExternalLink, trackWritingInteraction } from '../../lib/analytics';

interface WritingCardProps {
  writing: WritingContent;
  className?: string;
}

export function WritingCard({ writing, className = '' }: WritingCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLinkClick = () => {
    // Track writing interaction
    trackWritingInteraction(writing.title, 'click');
    trackExternalLink(writing.url, writing.title, writing.source);
  };

  const handleCardClick = () => {
    // Track writing view
    trackWritingInteraction(writing.title, 'view');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'external':
        return '🔗';
      case 'iframe':
        return '📄';
      case 'blog':
        return '✍️';
      default:
        return '📝';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'external':
        return 'External Article';
      case 'iframe':
        return 'Embedded Content';
      case 'blog':
        return 'Blog Post';
      default:
        return 'Article';
    }
  };

  return (
    <article 
      className={`group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer ${className}`}
      aria-labelledby={`writing-title-${writing.id}`}
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
    >
      {/* Featured Badge */}
      {writing.featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Featured
          </span>
        </div>
      )}

      {/* Thumbnail */}
      {writing.thumbnail && !imageError && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={writing.thumbnail}
            alt={`Thumbnail for ${writing.title}`}
            fill={true}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg" aria-hidden="true">
              {getTypeIcon(writing.type)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getTypeLabel(writing.type)}
            </span>
          </div>
          {writing.readTime && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {writing.readTime} min read
            </span>
          )}
        </div>

        {/* Title */}
        <h3 
          id={`writing-title-${writing.id}`}
          className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
        >
          {writing.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {writing.description}
        </p>

        {/* Tags */}
        {writing.tags && writing.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {writing.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
            {writing.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                +{writing.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={writing.publishedDate}>
              {formatDate(writing.publishedDate)}
            </time>
            {writing.author && (
              <span>by {writing.author}</span>
            )}
          </div>
          
          <a
            href={writing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            aria-label={`Read ${writing.title} (opens in new tab)`}
            onClick={(e) => {
              e.stopPropagation();
              handleLinkClick();
            }}
          >
            Read Article
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 pointer-events-none" />
    </article>
  );
} 