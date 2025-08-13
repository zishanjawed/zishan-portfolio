'use client';

import { useState } from 'react';
import { AlertCircle, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextField } from './text-field';
import { TextAreaField } from './text-area-field';

interface ObjectFieldProps {
  label: string;
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  error?: string;
  warning?: string;
  path: string;
  onDataChange: (path: string, value: any) => void;
}

export function ObjectField({
  label,
  value,
  onChange,
  error,
  warning,
  path,
  onDataChange
}: ObjectFieldProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const updateField = (key: string, newValue: any) => {
    const newObject = { ...value, [key]: newValue };
    onChange(newObject);
  };

  const renderField = (key: string, fieldValue: any) => {
    const fieldPath = `${path}.${key}`;

    if (typeof fieldValue === 'string') {
      // Check if this is a description field
      if (key.toLowerCase().includes('description') || key.toLowerCase().includes('bio') || key.toLowerCase().includes('summary')) {
        return (
          <TextAreaField
            key={fieldPath}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={fieldValue}
            onChange={(newValue) => updateField(key, newValue)}
            rows={3}
          />
        );
      }
      
      return (
        <TextField
          key={fieldPath}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={fieldValue}
          onChange={(newValue) => updateField(key, newValue)}
          type={key === 'email' ? 'email' : key === 'url' ? 'url' : key === 'phone' ? 'tel' : 'text'}
        />
      );
    }

    if (typeof fieldValue === 'number') {
      return (
        <TextField
          key={fieldPath}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={fieldValue.toString()}
          onChange={(newValue) => updateField(key, Number(newValue))}
          type="number"
        />
      );
    }

    if (typeof fieldValue === 'boolean') {
      return (
        <div key={fieldPath} className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={fieldPath}
            checked={fieldValue}
            onChange={(e) => updateField(key, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor={fieldPath} className="text-sm font-medium">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        </div>
      );
    }

    if (Array.isArray(fieldValue)) {
      return (
        <div key={fieldPath} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {key.charAt(0).toUpperCase() + key.slice(1)}
            <span className="text-gray-500 ml-2">({fieldValue.length} items)</span>
          </label>
          <div className="pl-4 border-l-2 border-gray-200">
            <div className="text-sm text-gray-500">
              Array field - edit in main form
            </div>
          </div>
        </div>
      );
    }

    if (typeof fieldValue === 'object' && fieldValue !== null) {
      return (
        <div key={fieldPath} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <div className="pl-4 border-l-2 border-gray-200">
            <div className="text-sm text-gray-500">
              Nested object - edit in main form
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={fieldPath} className="text-sm text-gray-500">
        Unsupported field type: {key} ({typeof fieldValue})
      </div>
    );
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <CardTitle className="text-sm">
              {label}
              <span className="text-gray-500 ml-2">({Object.keys(value).length} fields)</span>
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {Object.entries(value).map(([key, fieldValue]) => renderField(key, fieldValue))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 flex items-center mt-4">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </p>
          )}

          {/* Warning Message */}
          {warning && !error && (
            <p className="text-sm text-yellow-600 flex items-center mt-4">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {warning}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
} 