'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface TextAreaFieldProps {
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

export function TextAreaField({
  label,
  value,
  onChange,
  error,
  warning,
  required = false,
  placeholder,
  helpText,
  disabled = false,
  rows = 4,
  maxLength
}: TextAreaFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);

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

  const characterCount = localValue.length;
  const isOverLimit = maxLength && characterCount > maxLength;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <textarea
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`
            block w-full rounded-md border px-3 py-2 text-sm resize-y
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
        
        {/* Error/Warning Icons */}
        {(error || warning) && (
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