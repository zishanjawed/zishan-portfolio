'use client';

import { useState, useMemo } from 'react';
import { ContentType } from './content-management-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  FileText, 
  User, 
  Briefcase, 
  FolderOpen, 
  Code,
  ExternalLink,
  Calendar
} from 'lucide-react';

interface ContentSearchProps {
  contentData: any;
  onContentTypeSelect: (type: ContentType) => void;
  onTabChange: (tab: string) => void;
}

interface SearchResult {
  contentType: ContentType;
  path: string;
  title: string;
  snippet: string;
  field: string;
  relevance: number;
}

export function ContentSearch({ 
  contentData, 
  onContentTypeSelect, 
  onTabChange 
}: ContentSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Set<ContentType>>(new Set());
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const contentTypeIcons = {
    person: User,
    experience: Briefcase,
    projects: FolderOpen,
    skills: Code,
    writing: FileText
  };

  const contentTypeLabels = {
    person: 'Person',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
    writing: 'Writing'
  };

  const performSearch = (query: string, filters: Set<ContentType>) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    Object.entries(contentData).forEach(([contentType, data]) => {
      if (filters.size > 0 && !filters.has(contentType as ContentType)) {
        return;
      }

      const searchInObject = (obj: any, path: string = '') => {
        if (!obj || typeof obj !== 'object') return;

        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;

          if (typeof value === 'string' && value.toLowerCase().includes(searchTerm)) {
            const snippet = value.length > 100 
              ? value.substring(0, 100) + '...' 
              : value;

            results.push({
              contentType: contentType as ContentType,
              path: currentPath,
              title: getTitleForPath(contentType as ContentType, obj, key),
              snippet,
              field: key,
              relevance: calculateRelevance(value, searchTerm)
            });
          } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (typeof item === 'object' && item !== null) {
                searchInObject(item, `${currentPath}[${index}]`);
              } else if (typeof item === 'string' && item.toLowerCase().includes(searchTerm)) {
                const snippet = item.length > 100 
                  ? item.substring(0, 100) + '...' 
                  : item;

                results.push({
                  contentType: contentType as ContentType,
                  path: `${currentPath}[${index}]`,
                  title: getTitleForPath(contentType as ContentType, obj, key),
                  snippet,
                  field: key,
                  relevance: calculateRelevance(item, searchTerm)
                });
              }
            });
          } else if (typeof value === 'object' && value !== null) {
            searchInObject(value, currentPath);
          }
        });
      };

      searchInObject(data);
    });

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    setSearchResults(results);
  };

  const getTitleForPath = (contentType: ContentType, obj: any, key: string): string => {
    switch (contentType) {
      case 'person':
        return obj.name || 'Person Information';
      case 'experience':
        if (key === 'workExperience') return 'Work Experience';
        if (key === 'education') return 'Education';
        return 'Experience';
      case 'projects':
        return 'Projects';
      case 'skills':
        return 'Skills';
      case 'writing':
        return 'Writing';
      default:
        return contentType.charAt(0).toUpperCase() + contentType.slice(1);
    }
  };

  const calculateRelevance = (text: string, searchTerm: string): number => {
    const lowerText = text.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    
    // Exact match gets highest score
    if (lowerText === lowerSearch) return 100;
    
    // Starts with search term
    if (lowerText.startsWith(lowerSearch)) return 90;
    
    // Contains search term
    if (lowerText.includes(lowerSearch)) return 80;
    
    // Partial word match
    const words = lowerText.split(/\s+/);
    const searchWords = lowerSearch.split(/\s+/);
    
    let score = 0;
    searchWords.forEach(searchWord => {
      words.forEach(word => {
        if (word.startsWith(searchWord)) score += 70;
        else if (word.includes(searchWord)) score += 60;
      });
    });
    
    return score;
  };

  const handleSearch = () => {
    performSearch(searchQuery, selectedFilters);
  };

  const handleFilterToggle = (contentType: ContentType) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(contentType)) {
      newFilters.delete(contentType);
    } else {
      newFilters.add(contentType);
    }
    setSelectedFilters(newFilters);
    performSearch(searchQuery, newFilters);
  };

  const handleResultClick = (result: SearchResult) => {
    onContentTypeSelect(result.contentType);
    onTabChange('editor');
  };

  const clearFilters = () => {
    setSelectedFilters(new Set());
    performSearch(searchQuery, new Set());
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search across all content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button onClick={handleSearch}>
            Search
          </Button>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by content type:</span>
            {selectedFilters.size > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Clear filters
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {(['person', 'experience', 'projects', 'skills', 'writing'] as ContentType[]).map((type) => {
              const Icon = contentTypeIcons[type];
              const isSelected = selectedFilters.has(type);
              
              return (
                <Button
                  key={type}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterToggle(type)}
                  className="flex items-center space-x-1"
                >
                  <Icon className="h-3 w-3" />
                  <span>{contentTypeLabels[type]}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Search Results
          </h3>
          {searchResults.length > 0 && (
            <span className="text-sm text-gray-500">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </span>
          )}
        </div>

        {searchQuery && searchResults.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No results found for "{searchQuery}"</p>
                <p className="text-sm">Try adjusting your search terms or filters</p>
              </div>
            </CardContent>
          </Card>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-3">
            {searchResults.map((result, index) => {
              const Icon = contentTypeIcons[result.contentType];
              
              return (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleResultClick(result)}
                >
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 text-gray-500" />
                          <Badge variant="outline" className="text-xs">
                            {contentTypeLabels[result.contentType]}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {result.field}
                          </Badge>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                      
                      <h4 className="font-medium text-gray-900">{result.title}</h4>
                      
                      <p className="text-sm text-gray-600">
                        {result.snippet}
                      </p>
                      
                      <p className="text-xs text-gray-500">
                        Path: {result.path}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 