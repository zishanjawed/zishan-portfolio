# Search Implementation Documentation

## Overview

The portfolio includes a comprehensive fuzzy search system that allows visitors to quickly find content across all portfolio sections including projects, writing, experience, skills, and personal information.

## Features

### Core Functionality
- **Fuzzy Search**: Uses Fuse.js for flexible text matching with typo tolerance
- **Real-time Results**: Instant search results with debouncing for performance
- **Multi-content Search**: Searches across projects, articles, skills, experience, and personal info
- **Keyboard Navigation**: Full keyboard support with arrow keys, enter, and escape
- **Search Suggestions**: Intelligent suggestions based on content
- **Result Highlighting**: Visual highlighting of matched terms
- **Analytics Tracking**: Search interactions are tracked for insights

### User Experience
- **"/" Keyboard Shortcut**: Quick access from anywhere on the site
- **Modal Interface**: Clean, accessible modal with proper focus management
- **Loading States**: Visual feedback during search operations
- **Error Handling**: Graceful error handling with user-friendly messages
- **Accessibility**: Full screen reader support and keyboard navigation

## Architecture

### File Structure
```
lib/search/
├── fuzzy-search.ts      # Core search algorithm and data loading
└── search-utils.ts      # Utility functions and helpers

hooks/
├── use-search.ts        # Search state management hook
└── use-keyboard-shortcut.ts # Keyboard shortcut management

components/search/
├── search-modal.tsx     # Main search modal component
├── search-results.tsx   # Search results display component
├── search-button.tsx    # Search button components
└── search-provider.tsx  # Global search context provider
```

### Key Components

#### 1. Fuzzy Search Engine (`fuzzy-search.ts`)
- **Fuse.js Integration**: Configurable fuzzy search with relevance scoring
- **Content Loading**: Loads and caches all portfolio content
- **Result Processing**: Formats results with highlights and metadata
- **Performance Optimization**: 10-minute cache for search data

#### 2. Search Hook (`use-search.ts`)
- **State Management**: Manages search query, results, and UI state
- **Debouncing**: Prevents excessive API calls during typing
- **Analytics**: Tracks search interactions
- **Error Handling**: Validates queries and handles errors

#### 3. Search Modal (`search-modal.tsx`)
- **Radix UI Dialog**: Accessible modal implementation
- **Keyboard Navigation**: Arrow keys, enter, escape support
- **Focus Management**: Proper focus trapping and restoration
- **Loading States**: Visual feedback for search operations

#### 4. Search Provider (`search-provider.tsx`)
- **Global State**: Manages search modal state across the app
- **Keyboard Shortcuts**: Handles "/" key globally
- **Context API**: Provides search functionality to all components

## Usage

### Basic Implementation

The search is automatically available throughout the app via the `SearchProvider` in the root layout:

```tsx
// src/app/layout.tsx
import { SearchProvider } from '@/components/search/search-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SearchProvider>
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}
```

### Using Search Buttons

```tsx
import { SearchButton, SearchButtonWithShortcut } from '@/components/search/search-button';

// Default search button
<SearchButton>Search</SearchButton>

// Button with keyboard shortcut display
<SearchButtonWithShortcut />

// Custom variants
<SearchButton variant="outline" size="lg">
  Search Projects
</SearchButton>
```

### Programmatic Search

```tsx
import { useSearch } from '@/components/search/search-provider';

function MyComponent() {
  const { openSearch } = useSearch();
  
  const handleSearch = () => {
    openSearch('payment systems'); // Opens search with initial query
  };
  
  return <button onClick={handleSearch}>Search Payment Systems</button>;
}
```

### Custom Search Hook

```tsx
import { useSearch as useSearchHook } from '@/hooks/use-search';

function CustomSearchComponent() {
  const {
    query,
    results,
    isLoading,
    search,
    clearSearch
  } = useSearchHook({
    debounceMs: 300,
    minQueryLength: 2,
    maxResults: 20
  });
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => search(e.target.value)}
        placeholder="Search..."
      />
      {isLoading && <div>Searching...</div>}
      {results.map(result => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
}
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Open search modal |
| `↑↓` | Navigate search results |
| `Enter` | Select highlighted result |
| `Escape` | Close search modal |
| `Cmd/Ctrl + K` | Alternative search shortcut |

## Search Content Types

### Projects
- **Searchable Fields**: Title, description, client, role, technologies, lessons
- **URL Format**: `/projects#{project-id}`
- **Metadata**: Client, role, dates, team size

### Writing/Articles
- **Searchable Fields**: Title, description, tags, category
- **URL Format**: Direct external links
- **Metadata**: Published date, read time, platform

### Experience
- **Searchable Fields**: Title, description, skills, technologies, role
- **URL Format**: `/experience#{experience-id}`
- **Metadata**: Start/end dates, role, company

### Skills
- **Searchable Fields**: Name, description, tags, technologies
- **URL Format**: `/skills#{skill-id}`
- **Metadata**: Category, last updated

### Personal Information
- **Searchable Fields**: Name, bio, skills
- **URL Format**: `/` (home page)
- **Metadata**: Last updated

## Configuration

### Fuse.js Options
```typescript
const fuseOptions = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.3, // Lower = more strict matching
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'technologies', weight: 0.1 },
    // ... more fields
  ],
  ignoreLocation: true,
  findAllMatches: true,
  minMatchCharLength: 2,
};
```

### Search Hook Options
```typescript
const searchOptions = {
  debounceMs: 300,        // Debounce delay
  minQueryLength: 2,      // Minimum query length
  maxResults: 20,         // Maximum results
  enableSuggestions: true // Enable search suggestions
};
```

## Performance Considerations

### Caching
- **Search Data Cache**: 10-minute TTL for loaded content
- **Result Caching**: Prevents redundant searches
- **Memory Management**: Automatic cache cleanup

### Optimization
- **Debouncing**: Prevents excessive API calls
- **Lazy Loading**: Content loaded only when needed
- **Result Limiting**: Configurable result limits
- **Efficient Matching**: Optimized Fuse.js configuration

### Large Content Sets
- **Pagination**: Results limited to prevent UI lag
- **Virtual Scrolling**: For very large result sets (future enhancement)
- **Search Indexing**: Pre-built search indices (future enhancement)

## Analytics

Search interactions are automatically tracked:

```typescript
// Tracked Events
trackSearchEvent('search_started', { query: 'payment' });
trackSearchEvent('search_completed', { 
  query: 'payment', 
  resultCount: 5, 
  searchTime: 150 
});
trackSearchEvent('search_result_clicked', { 
  query: 'payment', 
  resultType: 'project', 
  resultId: 'payment-platform' 
});
```

## Testing

### Unit Tests
- **Fuzzy Search**: Tests for search accuracy and performance
- **Search Modal**: Component rendering and interaction tests
- **Keyboard Shortcuts**: Shortcut functionality tests

### Manual Testing
- **Search Demo Page**: `/search-demo` for interactive testing
- **Keyboard Navigation**: Test all keyboard shortcuts
- **Accessibility**: Screen reader and keyboard-only navigation

## Future Enhancements

### Planned Features
- **Search Filters**: Filter by content type, date, category
- **Advanced Search**: Boolean operators, exact phrase matching
- **Search History**: Recent searches and suggestions
- **Voice Search**: Voice input support
- **Search Analytics**: Detailed search insights dashboard

### Performance Improvements
- **Search Indexing**: Pre-built search indices for faster results
- **Virtual Scrolling**: Handle very large result sets
- **Background Indexing**: Real-time content indexing
- **CDN Caching**: Distributed search result caching

## Troubleshooting

### Common Issues

1. **Search not working**
   - Check if `SearchProvider` is properly configured in layout
   - Verify content files exist and are valid JSON
   - Check browser console for errors

2. **Keyboard shortcuts not working**
   - Ensure no form inputs are focused
   - Check for conflicting keyboard shortcuts
   - Verify event listeners are properly attached

3. **Slow search performance**
   - Check content file sizes
   - Verify caching is working
   - Consider reducing search data or optimizing queries

4. **Accessibility issues**
   - Test with screen readers
   - Verify keyboard navigation works
   - Check focus management

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
DEBUG=search:* npm run dev
```

This will log search operations, performance metrics, and error details. 