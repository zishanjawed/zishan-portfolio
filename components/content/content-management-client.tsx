'use client';

import { useState, useEffect } from 'react';
import { ContentEditor } from './content-editor';
import { ContentPreview } from './content-preview';
import { ContentSearch } from './content-search';
import { ContentVersioning } from './content-versioning';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Edit3, 
  Eye, 
  Search, 
  History, 
  Save, 
  Download, 
  Upload,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export type ContentType = 'person' | 'experience' | 'projects' | 'skills' | 'writing';

interface ContentData {
  person: any;
  experience: any;
  projects: any;
  skills: any;
  writing: any;
}

interface SaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error';
  message?: string;
  timestamp?: Date;
}

export function ContentManagementClient() {
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('person');
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ status: 'idle' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial content data
  useEffect(() => {
    loadContentData();
  }, []);

  const loadContentData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/content');
      if (!response.ok) {
        throw new Error('Failed to load content data');
      }
      
      const data = await response.json();
      setContentData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentUpdate = async (contentType: ContentType, data: any) => {
    try {
      setSaveStatus({ status: 'saving' });
      
      const response = await fetch(`/api/content/${contentType}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      // Update local state
      setContentData(prev => prev ? { ...prev, [contentType]: data } : null);
      setSaveStatus({ 
        status: 'saved', 
        message: 'Content saved successfully',
        timestamp: new Date()
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ status: 'idle' });
      }, 3000);

    } catch (err) {
      setSaveStatus({ 
        status: 'error', 
        message: err instanceof Error ? err.message : 'Failed to save content',
        timestamp: new Date()
      });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/content/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentType: selectedContentType }),
      });

      if (!response.ok) {
        throw new Error('Failed to export content');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedContentType}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export content');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error loading content</span>
          </div>
          <p className="text-red-600 mt-2">{error}</p>
          <Button 
            onClick={loadContentData} 
            variant="outline" 
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!contentData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-600">No content data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Content Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Edit3 className="h-5 w-5" />
            <span>Content Type</span>
          </CardTitle>
          <CardDescription>
            Select the type of content you want to manage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(['person', 'experience', 'projects', 'skills', 'writing'] as ContentType[]).map((type) => (
              <Button
                key={type}
                variant={selectedContentType === type ? 'default' : 'outline'}
                onClick={() => setSelectedContentType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Status */}
      {saveStatus.status !== 'idle' && (
        <Card className={saveStatus.status === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              {saveStatus.status === 'saving' && <Clock className="h-4 w-4 animate-spin" />}
              {saveStatus.status === 'saved' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {saveStatus.status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
              <span className={saveStatus.status === 'error' ? 'text-red-800' : 'text-green-800'}>
                {saveStatus.message}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Management Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="editor" className="flex items-center space-x-2">
            <Edit3 className="h-4 w-4" />
            <span>Editor</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </TabsTrigger>
          <TabsTrigger value="versioning" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold capitalize">
              Edit {selectedContentType} Content
            </h2>
            <div className="flex space-x-2">
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <ContentEditor
            contentType={selectedContentType}
            initialData={contentData[selectedContentType]}
            onSave={(data) => handleContentUpdate(selectedContentType, data)}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <h2 className="text-xl font-semibold capitalize">
            Preview {selectedContentType} Content
          </h2>
          
          <ContentPreview
            contentType={selectedContentType}
            data={contentData[selectedContentType]}
          />
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <h2 className="text-xl font-semibold">
            Search Content
          </h2>
          
          <ContentSearch
            contentData={contentData}
            onContentTypeSelect={setSelectedContentType}
            onTabChange={setActiveTab}
          />
        </TabsContent>

        <TabsContent value="versioning" className="space-y-4">
          <h2 className="text-xl font-semibold">
            Content History
          </h2>
          
          <ContentVersioning
            contentType={selectedContentType}
            onRestore={(data) => handleContentUpdate(selectedContentType, data)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 