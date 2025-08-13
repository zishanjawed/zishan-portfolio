'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { SearchModal } from './search-modal';
import { useSearchShortcut } from '@/hooks/use-keyboard-shortcut';

interface SearchContextType {
  isSearchOpen: boolean;
  openSearch: (initialQuery?: string) => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

interface SearchProviderProps {
  children: React.ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');

  const openSearch = useCallback((query?: string) => {
    setInitialQuery(query || '');
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setInitialQuery('');
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev);
  }, []);

  // Set up keyboard shortcut
  useSearchShortcut(openSearch);

  const contextValue: SearchContextType = {
    isSearchOpen,
    openSearch,
    closeSearch,
    toggleSearch,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
      <SearchModal
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        initialQuery={initialQuery}
      />
    </SearchContext.Provider>
  );
} 