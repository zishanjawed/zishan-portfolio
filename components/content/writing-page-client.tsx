'use client';

import { WritingContent } from '../../types/writing';
import { WritingGrid } from './writing-grid';
import { WritingFilters } from './writing-filters';
import { Breadcrumbs, breadcrumbConfigs } from '../navigation/breadcrumbs';
import { useWritingFilters } from '../../hooks/use-writing-filters';
import { filterWritings } from '../../lib/filtering';
import { trackEvent } from '../../lib/analytics';

interface WritingPageClientProps {
  writings: WritingContent[];
  title: string;
  description: string;
  totalCount: number;
}

export function WritingPageClient({ 
  writings, 
  title, 
  description, 
  totalCount 
}: WritingPageClientProps) {
  const { filters, updateFilters, hasActiveFilters } = useWritingFilters(writings);
  
  // Filter writings based on current filter state
  const filteredWritings = filterWritings(writings, filters);
  
  // Track filter usage
  const handleFiltersChange = (newFilters: any) => {
    updateFilters(newFilters);
    
    // Track filter changes
    const activeFilters = Object.entries(newFilters).filter(([_, value]) => 
      value !== '' && value !== false
    );
    
    if (activeFilters.length > 0) {
      trackEvent({
        action: 'filter_applied',
        category: 'writing',
        label: `Filters: ${activeFilters.map(([key]) => key).join(', ')}`,
        value: activeFilters.length
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbConfigs.writing} />

        {/* Page Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
            {description}
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {filteredWritings.length} of {totalCount} article{totalCount !== 1 ? 's' : ''} 
            {hasActiveFilters && ' (filtered)'}
          </div>
        </header>

        {/* Filters */}
        <WritingFilters
          writings={writings}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Writing Grid */}
        <main>
          <WritingGrid writings={filteredWritings} />
        </main>
      </div>
    </div>
  );
} 