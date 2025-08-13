'use client';

import { useState } from 'react';
import { AlertCircle, AlertTriangle, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextField } from './text-field';
import { TextAreaField } from './text-area-field';

interface ArrayFieldProps {
  label: string;
  value: any[];
  onChange: (value: any[]) => void;
  error?: string;
  warning?: string;
  path: string;
  onDataChange: (path: string, value: any) => void;
}

export function ArrayField({
  label,
  value,
  onChange,
  error,
  warning,
  path,
  onDataChange
}: ArrayFieldProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItemExpansion = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const addItem = () => {
    const newItem = typeof value[0] === 'object' ? {} : '';
    const newArray = [...value, newItem];
    onChange(newArray);
  };

  const removeItem = (index: number) => {
    const newArray = value.filter((_, i) => i !== index);
    onChange(newArray);
    
    // Remove from expanded items
    const newExpanded = new Set(expandedItems);
    newExpanded.delete(index);
    setExpandedItems(newExpanded);
  };

  const updateItem = (index: number, newValue: any) => {
    const newArray = [...value];
    newArray[index] = newValue;
    onChange(newArray);
  };

  const renderArrayItem = (item: any, index: number) => {
    const itemPath = `${path}.${index}`;
    const isExpanded = expandedItems.has(index);

    if (typeof item === 'string') {
      return (
        <div key={index} className="flex items-center space-x-2">
          <TextField
            label={`Item ${index + 1}`}
            value={item}
            onChange={(newValue) => updateItem(index, newValue)}
            placeholder="Enter value"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removeItem(index)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    if (typeof item === 'number') {
      return (
        <div key={index} className="flex items-center space-x-2">
          <TextField
            label={`Item ${index + 1}`}
            value={item.toString()}
            onChange={(newValue) => updateItem(index, Number(newValue))}
            type="number"
            placeholder="Enter number"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removeItem(index)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    if (typeof item === 'object' && item !== null) {
      return (
        <Card key={index} className="border border-gray-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleItemExpansion(index)}
                  className="p-1"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                <CardTitle className="text-sm">
                  {item.name || item.title || item.label || `Item ${index + 1}`}
                </CardTitle>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          {isExpanded && (
            <CardContent className="pt-0">
              <div className="space-y-4">
                {Object.entries(item).map(([key, fieldValue]) => {
                  const fieldPath = `${itemPath}.${key}`;
                  
                  if (typeof fieldValue === 'string') {
                    // Check if this is a description field
                    if (key.toLowerCase().includes('description') || key.toLowerCase().includes('bio') || key.toLowerCase().includes('summary')) {
                      return (
                        <TextAreaField
                          key={fieldPath}
                          label={key.charAt(0).toUpperCase() + key.slice(1)}
                          value={fieldValue}
                          onChange={(newValue) => onDataChange(fieldPath, newValue)}
                          rows={3}
                        />
                      );
                    }
                    
                    return (
                      <TextField
                        key={fieldPath}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={fieldValue}
                        onChange={(newValue) => onDataChange(fieldPath, newValue)}
                        type={key === 'email' ? 'email' : key === 'url' ? 'url' : 'text'}
                      />
                    );
                  }

                  if (typeof fieldValue === 'number') {
                    return (
                      <TextField
                        key={fieldPath}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={fieldValue.toString()}
                        onChange={(newValue) => onDataChange(fieldPath, Number(newValue))}
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
                          onChange={(e) => onDataChange(fieldPath, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor={fieldPath} className="text-sm font-medium">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                      </div>
                    );
                  }

                  return (
                    <div key={fieldPath} className="text-sm text-gray-500">
                      Complex field: {key} ({typeof fieldValue})
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>
      );
    }

    return (
      <div key={index} className="text-sm text-gray-500">
        Unsupported item type: {typeof item}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          <span className="text-gray-500 ml-2">({value.length} items)</span>
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      </div>

      {value.length === 0 ? (
        <div className="text-sm text-gray-500 italic">
          No items in this array. Click "Add Item" to add one.
        </div>
      ) : (
        <div className="space-y-4">
          {value.map((item, index) => renderArrayItem(item, index))}
        </div>
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