import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchModal } from '@/components/search/search-modal';

// Mock the search hook
vi.mock('@/hooks/use-search', () => ({
  useSearch: vi.fn(() => ({
    query: '',
    results: [],
    suggestions: [],
    isLoading: false,
    error: null,
    hasSearched: false,
    searchTime: 0,
    resultCount: 0,
    search: vi.fn(),
    clearSearch: vi.fn(),
    handleResultClick: vi.fn(),
    handleSuggestionClick: vi.fn(),
    isEmpty: true,
    hasNoResults: false,
  }))
}));

// Mock Radix UI Dialog
vi.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dialog-root" data-open={open}>
      {open && children}
    </div>
  ),
  Portal: ({ children }: any) => <div data-testid="dialog-portal">{children}</div>,
  Overlay: ({ className }: any) => <div data-testid="dialog-overlay" className={className} />,
  Content: ({ children, className }: any) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
}));

describe('SearchModal', () => {
  const defaultProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    initialQuery: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render when open', () => {
    render(<SearchModal {...defaultProps} />);
    
    expect(screen.getByTestId('dialog-root')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-portal')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<SearchModal {...defaultProps} isOpen={false} />);
    
    expect(screen.getByTestId('dialog-root')).toHaveAttribute('data-open', 'false');
  });

  it('should render search input', () => {
    render(<SearchModal {...defaultProps} />);
    
    const input = screen.getByRole('textbox', { name: /search/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search projects, articles, skills...');
  });

  it('should render close button', () => {
    render(<SearchModal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close search/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should render keyboard shortcuts button', () => {
    render(<SearchModal {...defaultProps} />);
    
    const shortcutsButton = screen.getByRole('button', { name: /show keyboard shortcuts/i });
    expect(shortcutsButton).toBeInTheDocument();
  });

  it('should call onOpenChange when close button is clicked', () => {
    const onOpenChange = vi.fn();
    render(<SearchModal {...defaultProps} onOpenChange={onOpenChange} />);
    
    const closeButton = screen.getByRole('button', { name: /close search/i });
    fireEvent.click(closeButton);
    
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should show empty state when no query', () => {
    render(<SearchModal {...defaultProps} />);
    
    expect(screen.getByText('Search anything')).toBeInTheDocument();
    expect(screen.getByText('Search through projects, articles, skills, and experience')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    const mockUseSearch = vi.mocked(require('@/hooks/use-search').useSearch);
    mockUseSearch.mockReturnValue({
      query: 'test',
      results: [],
      suggestions: [],
      isLoading: true,
      error: null,
      hasSearched: false,
      searchTime: 0,
      resultCount: 0,
      search: vi.fn(),
      clearSearch: vi.fn(),
      handleResultClick: vi.fn(),
      handleSuggestionClick: vi.fn(),
      isEmpty: false,
      hasNoResults: false,
    });

    render(<SearchModal {...defaultProps} />);
    
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    const mockUseSearch = vi.mocked(require('@/hooks/use-search').useSearch);
    mockUseSearch.mockReturnValue({
      query: 'test',
      results: [],
      suggestions: [],
      isLoading: false,
      error: 'Search failed',
      hasSearched: false,
      searchTime: 0,
      resultCount: 0,
      search: vi.fn(),
      clearSearch: vi.fn(),
      handleResultClick: vi.fn(),
      handleSuggestionClick: vi.fn(),
      isEmpty: false,
      hasNoResults: false,
    });

    render(<SearchModal {...defaultProps} />);
    
    expect(screen.getByText('Search failed')).toBeInTheDocument();
  });

  it('should show no results state', () => {
    const mockUseSearch = vi.mocked(require('@/hooks/use-search').useSearch);
    mockUseSearch.mockReturnValue({
      query: 'nonexistent',
      results: [],
      suggestions: [],
      isLoading: false,
      error: null,
      hasSearched: true,
      searchTime: 100,
      resultCount: 0,
      search: vi.fn(),
      clearSearch: vi.fn(),
      handleResultClick: vi.fn(),
      handleSuggestionClick: vi.fn(),
      isEmpty: false,
      hasNoResults: true,
    });

    render(<SearchModal {...defaultProps} />);
    
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByText('Try a different search term')).toBeInTheDocument();
  });

  it('should show search results', () => {
    const mockResults = [
      {
        id: 'test-1',
        title: 'Test Project',
        description: 'A test project description',
        type: 'project' as const,
        url: '/projects#test-1',
        category: 'fintech',
        tags: ['test', 'project'],
        technologies: [{ name: 'Node.js', category: 'backend' }],
        relevance: 0.9,
        highlights: {},
        metadata: {
          client: 'Test Client',
          role: 'Developer',
        },
      },
    ];

    const mockUseSearch = vi.mocked(require('@/hooks/use-search').useSearch);
    mockUseSearch.mockReturnValue({
      query: 'test',
      results: mockResults,
      suggestions: [],
      isLoading: false,
      error: null,
      hasSearched: true,
      searchTime: 100,
      resultCount: 1,
      search: vi.fn(),
      clearSearch: vi.fn(),
      handleResultClick: vi.fn(),
      handleSuggestionClick: vi.fn(),
      isEmpty: false,
      hasNoResults: false,
    });

    render(<SearchModal {...defaultProps} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project description')).toBeInTheDocument();
    expect(screen.getByText('Project')).toBeInTheDocument();
    expect(screen.getByText('fintech')).toBeInTheDocument();
  });

  it('should show search suggestions', () => {
    const mockSuggestions = ['test suggestion 1', 'test suggestion 2'];

    const mockUseSearch = vi.mocked(require('@/hooks/use-search').useSearch);
    mockUseSearch.mockReturnValue({
      query: 'test',
      results: [],
      suggestions: mockSuggestions,
      isLoading: false,
      error: null,
      hasSearched: false,
      searchTime: 0,
      resultCount: 0,
      search: vi.fn(),
      clearSearch: vi.fn(),
      handleResultClick: vi.fn(),
      handleSuggestionClick: vi.fn(),
      isEmpty: false,
      hasNoResults: false,
    });

    render(<SearchModal {...defaultProps} />);
    
    expect(screen.getByText('Suggestions')).toBeInTheDocument();
    expect(screen.getByText('test suggestion 1')).toBeInTheDocument();
    expect(screen.getByText('test suggestion 2')).toBeInTheDocument();
  });

  it('should show search statistics in footer', () => {
    const mockUseSearch = vi.mocked(require('@/hooks/use-search').useSearch);
    mockUseSearch.mockReturnValue({
      query: 'test',
      results: [{ id: '1', title: 'Test', description: 'Test', type: 'project' as const, relevance: 0.9, highlights: {} }],
      suggestions: [],
      isLoading: false,
      error: null,
      hasSearched: true,
      searchTime: 150,
      resultCount: 1,
      search: vi.fn(),
      clearSearch: vi.fn(),
      handleResultClick: vi.fn(),
      handleSuggestionClick: vi.fn(),
      isEmpty: false,
      hasNoResults: false,
    });

    render(<SearchModal {...defaultProps} />);
    
    expect(screen.getByText('1 result in 150ms')).toBeInTheDocument();
  });

  it('should handle keyboard shortcuts button toggle', () => {
    render(<SearchModal {...defaultProps} />);
    
    const shortcutsButton = screen.getByRole('button', { name: /show keyboard shortcuts/i });
    fireEvent.click(shortcutsButton);
    
    // Should show keyboard shortcuts help
    expect(screen.getByText('Open search')).toBeInTheDocument();
    expect(screen.getByText('Navigate results')).toBeInTheDocument();
    expect(screen.getByText('Select result')).toBeInTheDocument();
    expect(screen.getByText('Close search')).toBeInTheDocument();
  });
}); 