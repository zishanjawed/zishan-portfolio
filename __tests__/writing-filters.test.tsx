import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WritingFilters, FilterState } from '../components/content/writing-filters';
import { WritingContent } from '../types/writing';

// Mock writing data for testing
const mockWritings: WritingContent[] = [
  {
    id: 'test-1',
    title: 'Building Scalable Payment Systems',
    description: 'A comprehensive guide to payment architecture',
    url: 'https://example.com/payment-systems',
    type: 'external',
    publishedDate: '2024-12-15T10:00:00Z',
    readTime: 12,
    tags: ['fintech', 'payments', 'architecture'],
    featured: true,
    author: 'Zishan Jawed',
    source: 'Medium'
  },
  {
    id: 'test-2',
    title: 'Microservices Patterns',
    description: 'Exploring microservices patterns and anti-patterns',
    url: 'https://example.com/microservices',
    type: 'external',
    publishedDate: '2024-11-20T14:30:00Z',
    readTime: 8,
    tags: ['microservices', 'backend', 'patterns'],
    featured: false,
    author: 'Zishan Jawed',
    source: 'Dev.to'
  }
];

const defaultFilters: FilterState = {
  platform: '',
  category: '',
  search: '',
  featured: false
};

describe('WritingFilters Component', () => {
  const mockOnFiltersChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all filter controls', () => {
    render(
      <WritingFilters
        writings={mockWritings}
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    // Check for search input
    expect(screen.getByPlaceholderText(/search articles/i)).toBeInTheDocument();
    
    // Check for platform filter
    expect(screen.getByLabelText(/filter by platform/i)).toBeInTheDocument();
    
    // Check for category filter
    expect(screen.getByLabelText(/filter by category/i)).toBeInTheDocument();
    
    // Check for featured checkbox
    expect(screen.getByLabelText(/show featured articles only/i)).toBeInTheDocument();
    
    // Check for advanced filters toggle
    expect(screen.getByText(/show advanced/i)).toBeInTheDocument();
  });

  it('should populate platform options from writings', () => {
    render(
      <WritingFilters
        writings={mockWritings}
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const platformSelect = screen.getByLabelText(/filter by platform/i);
    expect(platformSelect).toHaveValue('');
    
    // Check that options are populated
    expect(platformSelect).toHaveDisplayValue('All Platforms');
  });

  it('should populate category options from writings', () => {
    render(
      <WritingFilters
        writings={mockWritings}
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const categorySelect = screen.getByLabelText(/filter by category/i);
    expect(categorySelect).toHaveValue('');
    
    // Check that options are populated
    expect(categorySelect).toHaveDisplayValue('All Categories');
  });

  it('should handle search input changes', () => {
    render(
      <WritingFilters
        writings={mockWritings}
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search articles/i);
    fireEvent.change(searchInput, { target: { value: 'payment' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      search: 'payment'
    });
  });

  it('should handle platform filter changes', () => {
    render(
      <WritingFilters
        writings={mockWritings}
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const platformSelect = screen.getByLabelText(/filter by platform/i);
    fireEvent.change(platformSelect, { target: { value: 'Medium' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      platform: 'Medium'
    });
  });

  it('should handle category filter changes', () => {
    render(
      <WritingFilters
        writings={mockWritings}
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const categorySelect = screen.getByLabelText(/filter by category/i);
    fireEvent.change(categorySelect, { target: { value: 'fintech' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      category: 'fintech'
    });
  });

  it('should handle featured filter changes', () => {
    render(
      <WritingFilters
        writings={mockWritings}
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const featuredCheckbox = screen.getByLabelText(/show featured articles only/i);
    fireEvent.click(featuredCheckbox);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      featured: true
    });
  });

  it('should show clear filters button when filters are active', () => {
    const activeFilters: FilterState = {
      platform: 'Medium',
      category: '',
      search: '',
      featured: false
    };

    render(
      <WritingFilters
        writings={mockWritings}
        filters={activeFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    expect(screen.getByText(/clear filters/i)).toBeInTheDocument();
  });

  it('should not show clear filters button when no filters are active', () => {
    render(
      <WritingFilters
        writings={mockWritings}
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    expect(screen.queryByText(/clear filters/i)).not.toBeInTheDocument();
  });

  it('should clear all filters when clear button is clicked', () => {
    const activeFilters: FilterState = {
      platform: 'Medium',
      category: 'fintech',
      search: 'test',
      featured: true
    };

    render(
      <WritingFilters
        writings={mockWritings}
        filters={activeFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const clearButton = screen.getByText(/clear filters/i);
    fireEvent.click(clearButton);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      platform: '',
      category: '',
      search: '',
      featured: false
    });
  });

  it('should show active filters display when filters are active', () => {
    const activeFilters: FilterState = {
      platform: 'Medium',
      category: 'fintech',
      search: 'payment',
      featured: true
    };

    render(
      <WritingFilters
        writings={mockWritings}
        filters={activeFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    expect(screen.getByText(/active filters:/i)).toBeInTheDocument();
    expect(screen.getByText(/platform: medium/i)).toBeInTheDocument();
    expect(screen.getByText(/category: fintech/i)).toBeInTheDocument();
    expect(screen.getByText(/search: "payment"/i)).toBeInTheDocument();
    expect(screen.getAllByText(/featured only/i)).toHaveLength(2);
  });

  it('should toggle advanced filters section', () => {
    render(
      <WritingFilters
        writings={mockWritings}
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const toggleButton = screen.getByText(/show advanced/i);
    
    // Initially advanced filters should not be visible
    expect(screen.queryByText(/advanced filters/i)).not.toBeInTheDocument();
    
    // Click to show advanced filters
    fireEvent.click(toggleButton);
    
    expect(screen.getByText(/advanced filters/i)).toBeInTheDocument();
    expect(screen.getByText(/read time/i)).toBeInTheDocument();
    expect(screen.getByText(/date range/i)).toBeInTheDocument();
    
    // Click to hide advanced filters
    fireEvent.click(screen.getByText(/hide advanced/i));
    
    expect(screen.queryByText(/advanced filters/i)).not.toBeInTheDocument();
  });

  it('should show search clear button when search has value', () => {
    const filtersWithSearch: FilterState = {
      ...defaultFilters,
      search: 'test'
    };

    render(
      <WritingFilters
        writings={mockWritings}
        filters={filtersWithSearch}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const clearSearchButton = screen.getByLabelText(/clear search/i);
    expect(clearSearchButton).toBeInTheDocument();
    
    fireEvent.click(clearSearchButton);
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      search: ''
    });
  });

  it('should handle keyboard navigation', () => {
    render(
      <WritingFilters
        writings={mockWritings}
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search articles/i);
    
    // Test Escape key
    fireEvent.keyDown(searchInput, { key: 'Escape' });
    
    // The component should handle the escape key without throwing errors
    expect(searchInput).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA labels', () => {
    render(
      <WritingFilters
        writings={mockWritings}
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    // Check for proper ARIA labels
    expect(screen.getByLabelText(/search articles/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by platform/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/show featured articles only/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/toggle advanced filters/i)).toBeInTheDocument();
  });
}); 