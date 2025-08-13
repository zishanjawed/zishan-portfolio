import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Skeleton, SkeletonIframe } from '../components/ui/skeleton';

describe('Skeleton', () => {
  it('renders with default props', () => {
    const { container } = render(<Skeleton />);
    
    const skeleton = container.querySelector('[aria-hidden="true"]');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('bg-gray-200', 'dark:bg-gray-700', 'rounded-md', 'animate-pulse');
  });

  it('applies custom width and height', () => {
    const { container } = render(<Skeleton width="200px" height="100px" />);
    
    const skeleton = container.querySelector('[aria-hidden="true"]');
    expect(skeleton).toHaveStyle({ width: '200px', height: '100px' });
  });

  it('applies different rounded variants', () => {
    const { rerender, container } = render(<Skeleton rounded="none" />);
    
    let skeleton = container.querySelector('[aria-hidden="true"]');
    expect(skeleton).not.toHaveClass('rounded-md');
    
    rerender(<Skeleton rounded="full" />);
    skeleton = container.querySelector('[aria-hidden="true"]');
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('disables animation when animated is false', () => {
    const { container } = render(<Skeleton animated={false} />);
    
    const skeleton = container.querySelector('[aria-hidden="true"]');
    expect(skeleton).not.toHaveClass('animate-pulse');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    
    const skeleton = container.querySelector('[aria-hidden="true"]');
    expect(skeleton).toHaveClass('custom-class');
  });
});

describe('SkeletonIframe', () => {
  it('renders with default 16/9 aspect ratio', () => {
    const { container } = render(<SkeletonIframe />);
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('aspect-video');
  });

  it('applies different aspect ratios', () => {
    const { rerender, container } = render(<SkeletonIframe aspectRatio="4/3" />);
    
    let wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('aspect-[4/3]');
    
    rerender(<SkeletonIframe aspectRatio="1/1" />);
    wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('aspect-square');
    
    rerender(<SkeletonIframe aspectRatio="3/2" />);
    wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('aspect-[3/2]');
  });

  it('shows loading content with icon', () => {
    const { container } = render(<SkeletonIframe />);
    
    expect(screen.getByText('Loading content...')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('disables animation when animated is false', () => {
    const { container } = render(<SkeletonIframe animated={false} />);
    
    const skeleton = container.querySelector('[aria-hidden="true"]');
    expect(skeleton).not.toHaveClass('animate-pulse');
  });

  it('applies custom className', () => {
    const { container } = render(<SkeletonIframe className="custom-iframe-class" />);
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-iframe-class');
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(<SkeletonIframe />);
    
    const skeleton = container.querySelector('[aria-hidden="true"]');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });
}); 