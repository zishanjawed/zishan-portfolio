'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContentType } from './content-management-client';
import { TextField } from './editor-fields/text-field';
import { TextAreaField } from './editor-fields/text-area-field';
import { ArrayField } from './editor-fields/array-field';
import { ObjectField } from './editor-fields/object-field';
import { RichTextField } from './editor-fields/rich-text-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { validateContent } from '@/lib/content/validation';

interface ContentEditorProps {
  contentType: ContentType;
  initialData: any;
  onSave: (data: any) => Promise<void>;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  path: string;
  message: string;
}

interface ValidationWarning {
  path: string;
  message: string;
}

interface SaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error';
  message?: string;
}

export function ContentEditor({ contentType, initialData, onSave }: ContentEditorProps) {
  const [data, setData] = useState(initialData);
  const [validation, setValidation] = useState<ValidationResult>({ 
    isValid: true, 
    errors: [], 
    warnings: [] 
  });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ status: 'idle' });
  const [showPreview, setShowPreview] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (!hasChanges) return;

    const timeoutId = setTimeout(async () => {
      if (validation.isValid) {
        setSaveStatus({ status: 'saving' });
        try {
          await onSave(data);
          setSaveStatus({ status: 'saved', message: 'Auto-saved' });
          setHasChanges(false);
          
          // Clear success message after 2 seconds
          setTimeout(() => {
            setSaveStatus({ status: 'idle' });
          }, 2000);
        } catch (error) {
          setSaveStatus({ 
            status: 'error', 
            message: error instanceof Error ? error.message : 'Auto-save failed' 
          });
        }
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [data, validation.isValid, hasChanges, onSave]);

  // Validation
  useEffect(() => {
    const result = validateContent(contentType, data);
    setValidation(result);
  }, [data, contentType]);

  const handleDataChange = useCallback((path: string, value: any) => {
    setData(prevData => {
      const newData = { ...prevData };
      const pathParts = path.split('.');
      let current = newData;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }
      
      current[pathParts[pathParts.length - 1]] = value;
      setHasChanges(true);
      return newData;
    });
  }, []);

  const handleManualSave = async () => {
    if (!validation.isValid) {
      setSaveStatus({ 
        status: 'error', 
        message: 'Cannot save: Please fix validation errors' 
      });
      return;
    }

    setSaveStatus({ status: 'saving' });
    try {
      await onSave(data);
      setSaveStatus({ status: 'saved', message: 'Saved successfully' });
      setHasChanges(false);
      
      setTimeout(() => {
        setSaveStatus({ status: 'idle' });
      }, 2000);
    } catch (error) {
      setSaveStatus({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Save failed' 
      });
    }
  };

  const renderField = (key: string, value: any, path: string = '') => {
    const fieldPath = path ? `${path}.${key}` : key;
    const fieldError = validation.errors.find(err => err.path === fieldPath);
    const fieldWarning = validation.warnings.find(warn => warn.path === fieldPath);

    if (typeof value === 'string') {
      // Check if this is a description field that should use rich text
      if (key.toLowerCase().includes('description') || key.toLowerCase().includes('bio') || key.toLowerCase().includes('summary')) {
        return (
          <RichTextField
            key={fieldPath}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={value}
            onChange={(newValue) => handleDataChange(fieldPath, newValue)}
            error={fieldError?.message}
            warning={fieldWarning?.message}
            required={key === 'name' || key === 'title' || key === 'email'}
          />
        );
      }
      
      return (
        <TextField
          key={fieldPath}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value}
          onChange={(newValue) => handleDataChange(fieldPath, newValue)}
          error={fieldError?.message}
          warning={fieldWarning?.message}
          required={key === 'name' || key === 'title' || key === 'email'}
          type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
        />
      );
    }

    if (typeof value === 'number') {
      return (
        <TextField
          key={fieldPath}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value.toString()}
          onChange={(newValue) => handleDataChange(fieldPath, Number(newValue))}
          error={fieldError?.message}
          warning={fieldWarning?.message}
          type="number"
        />
      );
    }

    if (typeof value === 'boolean') {
      return (
        <div key={fieldPath} className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={fieldPath}
            checked={value}
            onChange={(e) => handleDataChange(fieldPath, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor={fieldPath} className="text-sm font-medium">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          {fieldError && (
            <span className="text-sm text-red-600">{fieldError.message}</span>
          )}
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <ArrayField
          key={fieldPath}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value}
          onChange={(newValue) => handleDataChange(fieldPath, newValue)}
          error={fieldError?.message}
          warning={fieldWarning?.message}
          path={fieldPath}
          onDataChange={handleDataChange}
        />
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <ObjectField
          key={fieldPath}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value}
          onChange={(newValue) => handleDataChange(fieldPath, newValue)}
          error={fieldError?.message}
          warning={fieldWarning?.message}
          path={fieldPath}
          onDataChange={handleDataChange}
        />
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with save status and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold capitalize">
            {contentType} Content Editor
          </h3>
          
          {/* Save Status */}
          {saveStatus.status !== 'idle' && (
            <div className="flex items-center space-x-2">
              {saveStatus.status === 'saving' && <Clock className="h-4 w-4 animate-spin text-blue-600" />}
              {saveStatus.status === 'saved' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {saveStatus.status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
              <span className={`text-sm ${
                saveStatus.status === 'error' ? 'text-red-600' : 
                saveStatus.status === 'saved' ? 'text-green-600' : 
                'text-blue-600'
              }`}>
                {saveStatus.message}
              </span>
            </div>
          )}

          {/* Validation Status */}
          <div className="flex items-center space-x-2">
            {validation.isValid ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Valid
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                {validation.errors.length} Error{validation.errors.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          
          <Button
            onClick={handleManualSave}
            disabled={!validation.isValid || saveStatus.status === 'saving'}
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(data).map(([key, value]) => renderField(key, value))}
          </CardContent>
        </Card>

        {/* Preview Panel */}
        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Validation Errors Summary */}
      {validation.errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Validation Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {validation.errors.map((error, index) => (
                <li key={index} className="text-red-700 text-sm">
                  <strong>{error.path}:</strong> {error.message}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Validation Warnings Summary */}
      {validation.warnings.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Validation Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {validation.warnings.map((warning, index) => (
                <li key={index} className="text-yellow-700 text-sm">
                  <strong>{warning.path}:</strong> {warning.message}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 