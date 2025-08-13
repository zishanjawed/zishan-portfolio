import { promises as fs } from 'fs';
import path from 'path';
import { ProjectsPageDataSchema, ProjectsPageData } from '../../schemas/projects';

/**
 * Load projects content from JSON file with Zod validation
 * @returns Promise<ProjectsPageData> - Validated projects page data
 * @throws Error - If file cannot be read or validation fails
 */
export async function loadProjectsContent(): Promise<ProjectsPageData> {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'projects.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const jsonData = JSON.parse(rawData);
    
    // Validate data with Zod schema
    const validatedData = ProjectsPageDataSchema.parse(jsonData);
    
    return validatedData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load projects content: ${error.message}`);
    }
    throw new Error('Failed to load projects content: Unknown error');
  }
}

/**
 * Get featured projects from the content
 * @param projects - Array of project content
 * @returns ProjectContent[] - Featured projects only
 */
export function getFeaturedProjects(projects: ProjectsPageData['projects']) {
  return projects.filter(project => project.featured);
}

/**
 * Filter projects by category
 * @param projects - Array of project content
 * @param category - Category to filter by
 * @returns ProjectContent[] - Filtered projects
 */
export function filterProjectsByCategory(
  projects: ProjectsPageData['projects'], 
  category: string
) {
  return projects.filter(project => project.category === category);
}

/**
 * Filter projects by technology
 * @param projects - Array of project content
 * @param technology - Technology name to filter by
 * @returns ProjectContent[] - Filtered projects
 */
export function filterProjectsByTechnology(
  projects: ProjectsPageData['projects'], 
  technology: string
) {
  return projects.filter(project => 
    project.technologies.some(tech => 
      tech.name.toLowerCase().includes(technology.toLowerCase())
    )
  );
}

/**
 * Filter projects by client
 * @param projects - Array of project content
 * @param client - Client name to filter by
 * @returns ProjectContent[] - Filtered projects
 */
export function filterProjectsByClient(
  projects: ProjectsPageData['projects'], 
  client: string
) {
  return projects.filter(project => 
    project.client.toLowerCase().includes(client.toLowerCase())
  );
}

/**
 * Filter projects by status
 * @param projects - Array of project content
 * @param status - Status to filter by
 * @returns ProjectContent[] - Filtered projects
 */
export function filterProjectsByStatus(
  projects: ProjectsPageData['projects'], 
  status: 'completed' | 'in-progress' | 'on-hold' | 'archived'
) {
  return projects.filter(project => project.status === status);
}

/**
 * Sort projects by start date (newest first)
 * @param projects - Array of project content
 * @returns ProjectContent[] - Sorted projects
 */
export function sortProjectsByDate(projects: ProjectsPageData['projects']) {
  return [...projects].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

/**
 * Get unique categories from projects
 * @param projects - Array of project content
 * @returns string[] - Unique categories
 */
export function getUniqueCategories(projects: ProjectsPageData['projects']) {
  return [...new Set(projects.map(project => project.category))];
}

/**
 * Get unique technologies from projects
 * @param projects - Array of project content
 * @returns string[] - Unique technology names
 */
export function getUniqueTechnologies(projects: ProjectsPageData['projects']) {
  const technologies = projects.flatMap(project => 
    project.technologies.map(tech => tech.name)
  );
  return [...new Set(technologies)];
}

/**
 * Get unique clients from projects
 * @param projects - Array of project content
 * @returns string[] - Unique client names
 */
export function getUniqueClients(projects: ProjectsPageData['projects']) {
  return [...new Set(projects.map(project => project.client))];
}

/**
 * Search projects by title, description, or client
 * @param projects - Array of project content
 * @param searchTerm - Search term to look for
 * @returns ProjectContent[] - Filtered projects
 */
export function searchProjects(
  projects: ProjectsPageData['projects'], 
  searchTerm: string
) {
  const term = searchTerm.toLowerCase();
  return projects.filter(project => 
    project.title.toLowerCase().includes(term) ||
    project.description.toLowerCase().includes(term) ||
    project.client.toLowerCase().includes(term) ||
    project.technologies.some(tech => 
      tech.name.toLowerCase().includes(term)
    )
  );
} 