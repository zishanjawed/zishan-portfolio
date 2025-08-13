import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LazyIframe } from '../components/content/lazy-iframe';
import * as analytics from '../lib/analytics';

// Mock Intersection Observer
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
global.IntersectionObserver = mockIntersectionObserver;

// Mock analytics
vi.mock('../lib/analytics', () => ({
  trackEvent: vi.fn(),
}));

describe('LazyIframe', () => {
  const defaultProps = {
    src: 'https://example.com/embed',
    title: 'Test Iframe Content',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton loading state initially', () => {
    const { container } = render(<LazyIframe {...defaultProps} />);
    
    expect(screen.getByText('Loading content...')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('shows iframe when intersection observer triggers', async () => {
    const { container } = render(<LazyIframe {...defaultProps} />);
    
    // Simulate intersection observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    const mockEntry = {
      isIntersecting: true,
      target: container.firstChild,
    };
    
    act(() => {
      observerCallback([mockEntry]);
    });
    
    await waitFor(() => {
      const iframe = screen.getByTitle('Test Iframe Content');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', 'https://example.com/embed');
    });
  });

  it('applies correct aspect ratio classes', () => {
    const { container } = render(
      <LazyIframe {...defaultProps} aspectRatio="4/3" />
    );
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('aspect-[4/3]');
  });

  it('tracks iframe load events', async () => {
    const trackEventSpy = vi.spyOn(analytics, 'trackEvent');
    
    render(<LazyIframe {...defaultProps} />);
    
    // Simulate intersection observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div'),
    };
    
    act(() => {
      observerCallback([mockEntry]);
    });
    
    await waitFor(() => {
      const iframe = screen.getByTitle('Test Iframe Content');
      act(() => {
        fireEvent.load(iframe);
      });
    });
    
    expect(trackEventSpy).toHaveBeenCalledWith({
      action: 'iframe_loaded',
      category: 'iframe',
      label: 'Test Iframe Content',
    });
  });

  it('tracks iframe error events', async () => {
    const trackEventSpy = vi.spyOn(analytics, 'trackEvent');
    
    render(<LazyIframe {...defaultProps} />);
    
    // Simulate intersection observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div'),
    };
    
    act(() => {
      observerCallback([mockEntry]);
    });
    
    await waitFor(() => {
      const iframe = screen.getByTitle('Test Iframe Content');
      // Mock the iframe to simulate an error by making contentWindow throw
      Object.defineProperty(iframe, 'contentWindow', {
        get: () => {
          throw new Error('Access denied');
        },
      });
      
      act(() => {
        fireEvent.error(iframe);
      });
    });
    
    // Wait for the error state to be processed
    await waitFor(() => {
      expect(trackEventSpy).toHaveBeenCalledWith({
        action: 'iframe_error',
        category: 'iframe',
        label: 'Test Iframe Content',
      });
    });
  });

  it('shows error state when iframe fails to load', async () => {
    render(<LazyIframe {...defaultProps} />);
    
    // Simulate intersection observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div'),
    };
    
    act(() => {
      observerCallback([mockEntry]);
    });
    
    await waitFor(() => {
      const iframe = screen.getByTitle('Test Iframe Content');
      // Mock the iframe to simulate an error by making contentWindow throw
      Object.defineProperty(iframe, 'contentWindow', {
        get: () => {
          throw new Error('Access denied');
        },
      });
      
      act(() => {
        fireEvent.error(iframe);
      });
    });
    
    // Wait for the blocked state to be rendered (since contentWindow throws)
    await waitFor(() => {
      expect(screen.getByText('Content Unavailable')).toBeInTheDocument();
      expect(screen.getByText('This content cannot be displayed due to security restrictions.')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows fallback content when iframe is blocked', async () => {
    render(
      <LazyIframe 
        {...defaultProps} 
        fallbackUrl="https://example.com/original"
      />
    );
    
    // Simulate intersection observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div'),
    };
    
    act(() => {
      observerCallback([mockEntry]);
    });
    
    // Simulate blocked iframe by throwing error when accessing contentWindow
    await waitFor(() => {
      const iframe = screen.getByTitle('Test Iframe Content');
      // Mock the blocked iframe behavior
      Object.defineProperty(iframe, 'contentWindow', {
        get: () => {
          throw new Error('Blocked');
        },
      });
    });
    
    // Wait for the blocked check to complete (1 second timeout)
    await waitFor(() => {
      expect(screen.getByText('Content Unavailable')).toBeInTheDocument();
      expect(screen.getByText('This content cannot be displayed due to security restrictions.')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /View Original Content/ })).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('calls onLoad callback when iframe loads successfully', async () => {
    const onLoadMock = vi.fn();
    
    render(<LazyIframe {...defaultProps} onLoad={onLoadMock} />);
    
    // Simulate intersection observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div'),
    };
    
    act(() => {
      observerCallback([mockEntry]);
    });
    
    await waitFor(() => {
      const iframe = screen.getByTitle('Test Iframe Content');
      act(() => {
        fireEvent.load(iframe);
      });
    });
    
    expect(onLoadMock).toHaveBeenCalled();
  });

  it('calls onError callback when iframe fails to load', async () => {
    const onErrorMock = vi.fn();
    
    render(<LazyIframe {...defaultProps} onError={onErrorMock} />);
    
    // Simulate intersection observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div'),
    };
    
    act(() => {
      observerCallback([mockEntry]);
    });
    
    await waitFor(() => {
      const iframe = screen.getByTitle('Test Iframe Content');
      // Mock the iframe to simulate an error by making contentWindow throw
      Object.defineProperty(iframe, 'contentWindow', {
        get: () => {
          throw new Error('Access denied');
        },
      });
      
      act(() => {
        fireEvent.error(iframe);
      });
    });
    
    // Wait for the error callback to be called
    await waitFor(() => {
      expect(onErrorMock).toHaveBeenCalledWith(expect.any(Error));
    }, { timeout: 3000 });
  });

  it('tracks iframe interactions', async () => {
    const trackEventSpy = vi.spyOn(analytics, 'trackEvent');
    
    render(<LazyIframe {...defaultProps} />);
    
    // Simulate intersection observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div'),
    };
    
    act(() => {
      observerCallback([mockEntry]);
    });
    
    await waitFor(() => {
      const iframe = screen.getByTitle('Test Iframe Content');
      act(() => {
        fireEvent.focus(iframe);
      });
    });
    
    expect(trackEventSpy).toHaveBeenCalledWith({
      action: 'iframe_interaction',
      category: 'iframe',
      label: 'Test Iframe Content',
    });
  });

  it('respects reduced motion preferences', () => {
    // Mock prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<LazyIframe {...defaultProps} />);
    
    // The skeleton should still be animated by default
    // but the component should handle reduced motion gracefully
    expect(screen.getByText('Loading content...')).toBeInTheDocument();
  });

  it('applies custom analytics category', async () => {
    const trackEventSpy = vi.spyOn(analytics, 'trackEvent');
    
    render(
      <LazyIframe 
        {...defaultProps} 
        analyticsCategory="custom_category"
      />
    );
    
    // Simulate intersection observer callback
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div'),
    };
    
    act(() => {
      observerCallback([mockEntry]);
    });
    
    await waitFor(() => {
      const iframe = screen.getByTitle('Test Iframe Content');
      act(() => {
        fireEvent.load(iframe);
      });
    });
    
    expect(trackEventSpy).toHaveBeenCalledWith({
      action: 'iframe_loaded',
      category: 'custom_category',
      label: 'Test Iframe Content',
    });
  });
}); 