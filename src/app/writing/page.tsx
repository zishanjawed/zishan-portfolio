import { Metadata } from 'next';
import { Suspense } from 'react';
import { loadWritingContent, sortWritingsByDate } from '../../../lib/content/writing';
import { WritingPageClient } from '../../../components/content/writing-page-client';
import { PerformanceMonitor } from '../../../components/analytics/performance-monitor';
import { generateWritingPageMetadata } from '../../../lib/seo/metadata';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    return generateWritingPageMetadata();
  } catch (error) {
    return {
      title: 'Writing & Articles',
      description: 'Technical articles and blog posts by Zishan Jawed',
    };
  }
}

// Loading component
function WritingPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="mb-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
          
          {/* Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Error component
function WritingPageError({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="text-red-500 mb-4">
          <svg 
            className="mx-auto h-12 w-12" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Unable to load content
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error.message || 'There was an error loading the writing content. Please try again later.'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// Main content component
async function WritingPageContent() {
  try {
    const data = await loadWritingContent();
    const sortedWritings = sortWritingsByDate(data.writings);

    // Generate JSON-LD structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: data.title,
      description: data.description,
      url: 'https://zishan.loopcraftlab.com/writing',
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: data.totalCount,
        itemListElement: sortedWritings.map((writing, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Article',
            name: writing.title,
            description: writing.description,
            url: writing.url,
            author: {
              '@type': 'Person',
              name: writing.author || 'Zishan Jawed'
            },
            datePublished: writing.publishedDate,
            publisher: {
              '@type': 'Organization',
              name: writing.source || 'Zishan Jawed'
            },
            ...(writing.readTime && { timeRequired: `PT${writing.readTime}M` })
          }
        }))
      }
    };

    return (
      <>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <PerformanceMonitor pageName="writing" />
        <WritingPageClient
          writings={sortedWritings}
          title={data.title}
          description={data.description}
          totalCount={data.totalCount}
        />
      </>
    );
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to load writing content');
  }
}

// Main page component
export default function WritingPage() {
  return (
    <Suspense fallback={<WritingPageLoading />}>
      <WritingPageContent />
    </Suspense>
  );
} 