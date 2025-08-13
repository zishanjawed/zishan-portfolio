import { useState, useMemo } from 'react';
import { ProjectContent } from '../schemas/projects';
import { ProjectFilters } from '../types/project-utils';
import { 
  searchProjects,
  filterProjectsByCategory,
  filterProjectsByTechnology,
  filterProjectsByClient,
  filterProjectsByStatus,
  sortProjectsByDate
} from '../lib/content/projects';

export function useProjectFilters(projects: ProjectContent[]) {
  const [filters, setFilters] = useState<ProjectFilters>({});

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply search filter
    if (filters.search) {
      filtered = searchProjects(filtered, filters.search);
    }

    // Apply category filter
    if (filters.category) {
      filtered = filterProjectsByCategory(filtered, filters.category);
    }

    // Apply technology filter
    if (filters.technology) {
      filtered = filterProjectsByTechnology(filtered, filters.technology);
    }

    // Apply client filter
    if (filters.client) {
      filtered = filterProjectsByClient(filtered, filters.client);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filterProjectsByStatus(filtered, filters.status);
    }

    // Sort by date (newest first)
    return sortProjectsByDate(filtered);
  }, [projects, filters]);

  const updateFilters = (newFilters: ProjectFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return {
    filters,
    filteredProjects,
    updateFilters,
    clearFilters,
    hasActiveFilters
  };
} 