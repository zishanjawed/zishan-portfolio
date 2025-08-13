import { Metadata } from 'next';
import { ContentManagementClient } from '@/components/content/content-management-client';

export const metadata: Metadata = {
  title: 'Content Management - Zishan Jawed',
  description: 'Manage portfolio content including person, experience, projects, and skills data',
  robots: 'noindex, nofollow', // Prevent indexing of admin pages
};

export default function ContentManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Content Management
          </h1>
          <p className="text-gray-600">
            Manage your portfolio content including personal information, experience, projects, and skills.
          </p>
        </div>
        
        <ContentManagementClient />
      </div>
    </div>
  );
} 