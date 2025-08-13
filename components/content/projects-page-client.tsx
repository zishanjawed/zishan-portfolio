'use client';

import React, { useState, useMemo } from 'react';
import { ProjectContent, ProjectsPageData } from '../../schemas/projects';
import { ProjectsGrid } from './projects-grid';
import { ProjectFiltersComponent } from './project-filters';
import { ProjectDrawer } from '../ui/project-drawer';
import { Breadcrumbs, breadcrumbConfigs } from '../navigation/breadcrumbs';
import { useProjectFilters } from '../../hooks/use-project-filters';
import { 
  getUniqueCategories, 
  getUniqueTechnologies, 
  getUniqueClients
} from '../../lib/content/projects';

interface ProjectsPageClientProps {
  data: ProjectsPageData;
}

export function ProjectsPageClient({ data }: ProjectsPageClientProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectContent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Use the custom hook for filtering
  const { filters, filteredProjects, updateFilters, hasActiveFilters } = useProjectFilters(data.projects);

  // Get unique filter options
  const categories = useMemo(() => getUniqueCategories(data.projects), [data.projects]);
  const technologies = useMemo(() => getUniqueTechnologies(data.projects), [data.projects]);
  const clients = useMemo(() => getUniqueClients(data.projects), [data.projects]);

  const handleProjectClick = (project: ProjectContent) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbConfigs.projects} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {data.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            {data.description}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ProjectFiltersComponent
            filters={filters}
            onFiltersChange={updateFilters}
            categories={categories}
            technologies={technologies}
            clients={clients}
          />
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredProjects.length} of {data.projects.length} projects
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>

        {/* Projects Grid */}
        <ProjectsGrid
          projects={filteredProjects}
          onProjectClick={handleProjectClick}
        />

        {/* Project Drawer */}
        <ProjectDrawer
          project={selectedProject}
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
        />
      </div>
    </div>
  );
} 