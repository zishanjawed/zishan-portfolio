import { WritingContent } from '../../types/writing';
import { WritingCard } from './writing-card';

interface WritingGridProps {
  writings: WritingContent[];
  className?: string;
}

export function WritingGrid({ writings, className = '' }: WritingGridProps) {
  if (!writings || writings.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500 dark:text-gray-400">
          <svg 
            className="mx-auto h-12 w-12 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No articles found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for new content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      role="grid"
      aria-label="Writing articles grid"
    >
      {writings.map((writing) => (
        <div key={writing.id} role="gridcell">
          <WritingCard writing={writing} />
        </div>
      ))}
    </div>
  );
} 