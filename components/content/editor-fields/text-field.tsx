'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  warning?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'url' | 'number';
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
}

export function TextField({
  label,
  value,
  onChange,
  error,
  warning,
  required = false,
  type = 'text',
  placeholder,
  helpText,
  disabled = false
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          type={type}
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            block w-full rounded-md border px-3 py-2 text-sm
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
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {error && (
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            )}
            {warning && !error && (
              <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            )}
          </div>
        )}
      </div>

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