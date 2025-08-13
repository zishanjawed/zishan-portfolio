// Utility types for projects (separate from schema types to avoid circular dependencies)
export interface ProjectFilters {
  category?: string;
  technology?: string;
  client?: string;
  status?: 'completed' | 'in-progress' | 'on-hold' | 'archived';
  search?: string;
}

export interface ProjectSortOptions {
  field: 'startDate' | 'title' | 'client' | 'status';
  direction: 'asc' | 'desc';
}

export interface ProjectCardProps {
  project: any; // Will be ProjectContent from schema
  className?: string;
  onClick?: (project: any) => void;
}

export interface ProjectDrawerProps {
  project: any | null; // Will be ProjectContent from schema
  isOpen: boolean;
  onClose: () => void;
}

export interface ProjectFiltersProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  categories: string[];
  technologies: string[];
  clients: string[];
  className?: string;
}

export interface ProjectsGridProps {
  projects: any[]; // Will be ProjectContent[] from schema
  onProjectClick?: (project: any) => void;
  className?: string;
} 