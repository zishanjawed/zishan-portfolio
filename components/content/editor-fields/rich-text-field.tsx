'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, Bold, Italic, Link, List, ListOrdered, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  warning?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
}

export function RichTextField({
  label,
  value,
  onChange,
  error,
  warning,
  required = false,
  placeholder,
  helpText,
  disabled = false,
  rows = 6,
  maxLength
}: RichTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [showPreview, setShowPreview] = useState(false);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector(`textarea[data-field="${label}"]`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = localValue.substring(start, end);
    const newText = localValue.substring(0, start) + prefix + selectedText + suffix + localValue.substring(end);
    
    setLocalValue(newText);
    onChange(newText);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const characterCount = localValue.length;
  const isOverLimit = maxLength && characterCount > maxLength;

  // Simple markdown to HTML conversion for preview
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 bg-gray-50 rounded-t-md border border-gray-300">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('**', '**')}
          disabled={disabled}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('*', '*')}
          disabled={disabled}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('[', '](url)')}
          disabled={disabled}
          className="h-8 w-8 p-0"
          title="Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('- ')}
          disabled={disabled}
          className="h-8 w-8 p-0"
          title="Unordered List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('1. ')}
          disabled={disabled}
          className="h-8 w-8 p-0"
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('> ')}
          disabled={disabled}
          className="h-8 w-8 p-0"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <div className="flex-1" />
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          disabled={disabled}
          className="text-xs"
        >
          {showPreview ? 'Edit' : 'Preview'}
        </Button>
      </div>
      
      <div className="relative">
        {showPreview ? (
          <div className="block w-full rounded-b-md border border-gray-300 px-3 py-2 text-sm bg-white min-h-[120px]">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(localValue) }}
            />
          </div>
        ) : (
          <textarea
            data-field={label}
            value={localValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            className={`
              block w-full rounded-b-md border border-gray-300 px-3 py-2 text-sm resize-y
              ${error 
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
                : warning 
                  ? 'border-yellow-300 text-yellow-900 placeholder-yellow-300 focus:border-yellow-500 focus:ring-yellow-500'
                  : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
              }
              ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
              focus:outline-none focus:ring-1 sm:text-sm
            `}
          />
        )}
        
        {/* Error/Warning Icons */}
        {(error || warning) && !showPreview && (
          <div className="absolute top-2 right-2">
            {error && (
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            )}
            {warning && !error && (
              <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            )}
          </div>
        )}
      </div>

      {/* Character Count */}
      {maxLength && (
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{characterCount} characters</span>
          <span className={isOverLimit ? 'text-red-500' : ''}>
            {characterCount}/{maxLength}
          </span>
        </div>
      )}

      {/* Help Text */}
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}

      {/* Warning Message */}
      {warning && !error && (
        <p className="text-sm text-yellow-600 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1" />
          {warning}
        </p>
      )}
    </div>
  );
} 