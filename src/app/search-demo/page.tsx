'use client';

import React from 'react';
import { SearchButton, SearchButtonWithShortcut } from '@/components/search/search-button';
import { useSearch } from '@/components/search/search-provider';

export default function SearchDemoPage() {
  const { openSearch } = useSearch();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Search Demo
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Test the Search Functionality
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                Search Buttons
              </h3>
              <div className="flex flex-wrap gap-4">
                <SearchButton variant="default" size="md">
                  Search Projects
                </SearchButton>
                <SearchButton variant="outline" size="md">
                  Search Articles
                </SearchButton>
                <SearchButton variant="ghost" size="md">
                  Search Skills
                </SearchButton>
                <SearchButtonWithShortcut />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                Programmatic Search
              </h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => openSearch('payment')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Search for "payment"
                </button>
                <button
                  onClick={() => openSearch('node.js')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Search for "node.js"
                </button>
                <button
                  onClick={() => openSearch('fintech')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Search for "fintech"
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                Keyboard Shortcuts
              </h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Try these keyboard shortcuts:
                </p>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border">/</kbd> to open search</li>
                  <li>• Press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border">↑↓</kbd> to navigate results</li>
                  <li>• Press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border">Enter</kbd> to select result</li>
                  <li>• Press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border">Escape</kbd> to close search</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                Sample Content to Search
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Projects</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Scalable Payment Processing Platform</li>
                    <li>• E-commerce Backend System</li>
                    <li>• Real-time Analytics Dashboard</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Articles</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Building Scalable Payment Systems</li>
                    <li>• Microservices Patterns</li>
                    <li>• AWS Cost Optimization</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Skills</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Node.js, Python, PostgreSQL</li>
                    <li>• Docker, Kubernetes, AWS</li>
                    <li>• Microservices, API Design</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Experience</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Senior Backend Engineer</li>
                    <li>• Lead Developer</li>
                    <li>• Technical Architect</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 