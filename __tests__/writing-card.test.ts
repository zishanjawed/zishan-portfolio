import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { WritingCard } from '../components/content/writing-card';
import { WritingContent } from '../types/writing';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, fill, ...props }: any) => {
    // Remove fill prop to avoid warning in tests
    const { fill: _, ...restProps } = props;
    return React.createElement('img', { src, alt, ...restProps });
  },
}));

// Mock analytics
vi.mock('../lib/analytics', () => ({
  trackExternalLink: vi.fn(),
}));

const mockWriting: WritingContent = {
  id: 'test-article',
  title: 'Test Article',
  description: 'This is a test article description',
  url: 'https://example.com/test',
  type: 'external',
  publishedDate: '2024-01-01T00:00:00Z',
  readTime: 5,
  tags: ['test', 'article'],
  featured: true,
  author: 'Zishan Jawed',
  source: 'Test Blog',
  thumbnail: 'https://example.com/thumbnail.jpg'
};

describe('WritingCard', () => {
  it('renders writing card with all information', () => {
    render(React.createElement(WritingCard, { writing: mockWriting }));
    
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    expect(screen.getByText('This is a test article description')).toBeInTheDocument();
    expect(screen.getByText('Featured')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
    expect(screen.getByText('by Zishan Jawed')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('article')).toBeInTheDocument();
    expect(screen.getByText('Read Article')).toBeInTheDocument();
  });

  it('renders external link with proper attributes', () => {
    render(React.createElement(WritingCard, { writing: mockWriting }));
    
    const link = screen.getByRole('link', { name: /read test article/i });
    expect(link).toHaveAttribute('href', 'https://example.com/test');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays correct type icon and label', () => {
    render(React.createElement(WritingCard, { writing: mockWriting }));
    
    expect(screen.getByText('External Article')).toBeInTheDocument();
  });

  it('formats date correctly', () => {
    render(React.createElement(WritingCard, { writing: mockWriting }));
    
    expect(screen.getByText('January 1, 2024')).toBeInTheDocument();
  });

  it('renders without optional fields', () => {
    const minimalWriting: WritingContent = {
      id: 'minimal-article',
      title: 'Minimal Article',
      description: 'Minimal description',
      url: 'https://example.com/minimal',
      type: 'blog',
      publishedDate: '2024-01-01T00:00:00Z'
    };
    
    render(React.createElement(WritingCard, { writing: minimalWriting }));
    
    expect(screen.getByText('Minimal Article')).toBeInTheDocument();
    expect(screen.getByText('Minimal description')).toBeInTheDocument();
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
    expect(screen.queryByText(/min read/)).not.toBeInTheDocument();
  });

  it('limits tags display to 3 with overflow indicator', () => {
    const writingWithManyTags: WritingContent = {
      ...mockWriting,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
    };
    
    render(React.createElement(WritingCard, { writing: writingWithManyTags }));
    
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
    expect(screen.getByText('+2 more')).toBeInTheDocument();
    expect(screen.queryByText('tag4')).not.toBeInTheDocument();
    expect(screen.queryByText('tag5')).not.toBeInTheDocument();
  });


}); 