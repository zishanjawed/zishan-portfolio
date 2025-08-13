'use client';

import React from 'react';
import { Search, Command } from 'lucide-react';
import { useSearch } from './search-provider';
import { cn } from '@/lib/utils/cn';

interface SearchButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showShortcut?: boolean;
  children?: React.ReactNode;
}

export function SearchButton({
  variant = 'default',
  size = 'md',
  className,
  showShortcut = true,
  children,
}: SearchButtonProps) {
  const { openSearch } = useSearch();

  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
  };

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={() => openSearch()}
      aria-label="Open search"
    >
      {children || (
        <>
          <Search className="w-4 h-4 mr-2" />
          <span>Search</span>
          {showShortcut && (
            <kbd className="ml-2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <Command className="w-3 h-3" />
              K
            </kbd>
          )}
        </>
      )}
    </button>
  );
}

// Compact search button for navigation
export function SearchButtonCompact({ className }: { className?: string }) {
  const { openSearch } = useSearch();

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      onClick={() => openSearch()}
      aria-label="Open search"
    >
      <Search className="w-4 h-4" />
    </button>
  );
}

// Search button with keyboard shortcut display
export function SearchButtonWithShortcut({ className }: { className?: string }) {
  const { openSearch } = useSearch();

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      onClick={() => openSearch()}
      aria-label="Open search"
    >
      <Search className="w-4 h-4 mr-2" />
      <span className="mr-2">Search</span>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        /
      </kbd>
    </button>
  );
} 