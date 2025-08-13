'use client';

import { useEffect, useCallback, useRef } from 'react';

interface UseKeyboardShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  preventDefault?: boolean;
  enabled?: boolean;
  onPress: () => void;
}

export function useKeyboardShortcut({
  key,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
  altKey = false,
  preventDefault = true,
  enabled = true,
  onPress,
}: UseKeyboardShortcutOptions) {
  const onPressRef = useRef(onPress);
  const enabledRef = useRef(enabled);

  // Update refs when props change
  useEffect(() => {
    onPressRef.current = onPress;
  }, [onPress]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabledRef.current) return;

    // Check if the key matches
    if (event.key.toLowerCase() !== key.toLowerCase()) return;

    // Check modifier keys
    if (ctrlKey && !event.ctrlKey) return;
    if (metaKey && !event.metaKey) return;
    if (shiftKey && !event.shiftKey) return;
    if (altKey && !event.altKey) return;

    // Check that no extra modifier keys are pressed
    if (ctrlKey && event.metaKey) return;
    if (metaKey && event.ctrlKey) return;

    // Prevent default behavior if requested
    if (preventDefault) {
      event.preventDefault();
    }

    // Call the callback
    onPressRef.current();
  }, [key, ctrlKey, metaKey, shiftKey, altKey, preventDefault]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

// Specific hook for search shortcut
export function useSearchShortcut(onOpen: () => void) {
  const isFormInput = useRef(false);

  // Check if the current target is a form input
  const handleFocusIn = useCallback((event: FocusEvent) => {
    const target = event.target as HTMLElement;
    isFormInput.current = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true';
  }, []);

  useEffect(() => {
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [handleFocusIn]);

  useKeyboardShortcut({
    key: '/',
    preventDefault: true,
    onPress: () => {
      // Don't trigger search if user is typing in a form input
      if (isFormInput.current) return;
      onOpen();
    },
  });
}

// Hook for multiple keyboard shortcuts
export function useKeyboardShortcuts(shortcuts: UseKeyboardShortcutOptions[]) {
  shortcuts.forEach(shortcut => {
    useKeyboardShortcut(shortcut);
  });
}

// Hook for search modal keyboard shortcuts
export function useSearchModalShortcuts(
  isOpen: boolean,
  onClose: () => void,
  onNavigateUp: () => void,
  onNavigateDown: () => void,
  onSelect: () => void
) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
      case 'ArrowUp':
        event.preventDefault();
        onNavigateUp();
        break;
      case 'ArrowDown':
        event.preventDefault();
        onNavigateDown();
        break;
      case 'Enter':
        event.preventDefault();
        onSelect();
        break;
    }
  }, [isOpen, onClose, onNavigateUp, onNavigateDown, onSelect]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);
}

// Hook for managing focus when modal opens/closes
export function useModalFocus(modalRef: React.RefObject<HTMLElement>, isOpen: boolean) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus the modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      // Restore focus to the previous element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen, modalRef]);
}

// Hook for preventing body scroll when modal is open
export function usePreventBodyScroll(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);
} 