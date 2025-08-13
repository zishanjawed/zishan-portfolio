import { Metadata } from 'next';
import { loadProjectsContent } from '../../../lib/content/projects';
import { ProjectsPageClient } from '../../../components/content/projects-page-client';
import { ProjectStructuredData } from '../../../components/seo/project-schema';
import { PerformanceMonitor } from '../../../components/analytics/performance-monitor';
import { generateProjectsPageMetadata } from '../../../lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  try {
    return generateProjectsPageMetadata();
  } catch (error) {
    return {
      title: 'Projects & Case Studies - Zishan Jawed',
      description: 'Explore Zishan Jawed\'s portfolio projects and case studies in fintech, ecommerce, and scalable backend architecture.',
    };
  }
}

export default async function ProjectsPage() {
  try {
    const data = await loadProjectsContent();
    
    return (
      <>
        <ProjectStructuredData data={data} />
        <PerformanceMonitor pageName="projects" />
        <ProjectsPageClient data={data} />
      </>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load projects content. Please try again later.
          </p>
        </div>
      </div>
    );
  }
} 