'use client';

import { useState, useEffect } from 'react';
import { ContentType } from './content-management-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  RotateCcw, 
  Download, 
  Upload, 
  Calendar,
  User,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ContentVersioningProps {
  contentType: ContentType;
  onRestore: (data: any) => void;
}

interface Version {
  id: string;
  timestamp: string;
  description: string;
  author: string;
  content: any;
  size: number;
  changes: string[];
}

export function ContentVersioning({ contentType, onRestore }: ContentVersioningProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    loadVersions();
  }, [contentType]);

  const loadVersions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/content/backup?type=${contentType}`);
      if (response.ok) {
        const data = await response.json();
        setVersions(data.versions || []);
      }
    } catch (error) {
      console.error('Failed to load versions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    try {
      const response = await fetch(`/api/content/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          versionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onRestore(data.content);
        setSelectedVersion(null);
      }
    } catch (error) {
      console.error('Failed to restore version:', error);
    }
  };

  const handleExport = async (versionId: string) => {
    try {
      const response = await fetch(`/api/content/backup/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          versionId,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${contentType}-backup-${versionId}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to export version:', error);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getContentTypeIcon = () => {
    switch (contentType) {
      case 'person':
        return <User className="h-4 w-4" />;
      case 'experience':
        return <History className="h-4 w-4" />;
      case 'projects':
        return <FileText className="h-4 w-4" />;
      case 'skills':
        return <FileText className="h-4 w-4" />;
      case 'writing':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading version history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getContentTypeIcon()}
          <h3 className="text-lg font-semibold text-gray-900">
            {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Version History
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadVersions}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Version List */}
      {versions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <History className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No version history available</p>
              <p className="text-sm">Versions will appear here after you make changes</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {versions.map((version) => (
            <Card 
              key={version.id}
              className={`cursor-pointer transition-all ${
                selectedVersion === version.id 
                  ? 'ring-2 ring-blue-500 border-blue-200' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedVersion(selectedVersion === version.id ? null : version.id)}
            >
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {/* Version Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          Version {version.id}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {formatSize(version.size)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{version.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExport(version.id);
                        }}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(version.id);
                        }}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                    </div>
                  </div>

                  {/* Version Details */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(version.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{version.author}</span>
                    </div>
                  </div>

                  {/* Changes Summary */}
                  {version.changes && version.changes.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">Changes:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {version.changes.slice(0, 3).map((change, index) => (
                          <li key={index} className="flex items-start space-x-1">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{change}</span>
                          </li>
                        ))}
                        {version.changes.length > 3 && (
                          <li className="text-xs text-gray-500">
                            +{version.changes.length - 3} more changes
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Expanded Content Preview */}
                  {selectedVersion === version.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-medium text-gray-900">Content Preview</h5>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDiff(!showDiff);
                            }}
                          >
                            {showDiff ? 'Hide' : 'Show'} Diff
                          </Button>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-auto">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                            {JSON.stringify(version.content, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Backup Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-blue-900">Automatic Backups</h4>
              <p className="text-sm text-blue-700">
                Your content is automatically backed up before each save. You can restore any previous version or export backups for safekeeping.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 