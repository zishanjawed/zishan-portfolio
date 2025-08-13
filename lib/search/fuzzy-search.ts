import Fuse from 'fuse.js';
import { loadProjectsContent } from '../content/projects';
import { loadWritingContent } from '../content/writing';
import { loadExperienceContent } from '../content/experience';
import { loadSkillsContent } from '../content/skills';
import { loadPersonContent } from '../content/person';

// Search result types
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'writing' | 'experience' | 'skill' | 'person';
  url?: string;
  category?: string;
  tags?: string[];
  technologies?: Array<{ name: string; category: string }>;
  relevance: number;
  highlights: {
    title?: string[];
    description?: string[];
    tags?: string[];
    technologies?: string[];
  };
  metadata?: {
    publishedDate?: string;
    readTime?: number;
    client?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
  };
}

// Search options for Fuse.js
const fuseOptions = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.3, // Lower threshold = more strict matching
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'technologies', weight: 0.1 },
    { name: 'category', weight: 0.1 },
    { name: 'client', weight: 0.1 },
    { name: 'role', weight: 0.1 },
  ],
  ignoreLocation: true,
  findAllMatches: true,
  minMatchCharLength: 2,
};

// Cache for search data
let searchDataCache: {
  data: SearchResult[];
  timestamp: number;
} | null = null;

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Load and prepare all content for search
 */
async function loadSearchData(): Promise<SearchResult[]> {
  try {
    // Check cache first
    if (searchDataCache && Date.now() - searchDataCache.timestamp < CACHE_TTL) {
      return searchDataCache.data;
    }

    const [projects, writing, experience, skills, person] = await Promise.all([
      loadProjectsContent(),
      loadWritingContent(),
      loadExperienceContent(),
      loadSkillsContent(),
      loadPersonContent(),
    ]);

    const searchData: SearchResult[] = [];

    // Add projects
    projects.projects.forEach((project) => {
      searchData.push({
        id: project.id,
        title: project.title,
        description: project.description,
        type: 'project',
        url: `/projects#${project.id}`,
        category: project.category,
        tags: project.caseStudy?.lessons || [],
        technologies: project.technologies,
        relevance: 0,
        highlights: {},
        metadata: {
          client: project.client,
          role: project.role,
          startDate: project.startDate,
          endDate: project.endDate,
        },
      });
    });

    // Add writing
    writing.writings.forEach((article) => {
      searchData.push({
        id: article.id,
        title: article.title,
        description: article.description,
        type: 'writing',
        url: article.url,
        category: article.category,
        tags: article.tags,
        relevance: 0,
        highlights: {},
        metadata: {
          publishedDate: article.publishedDate,
          readTime: article.readTime,
        },
      });
    });

    // Add experience
    experience.experience.forEach((exp) => {
      searchData.push({
        id: exp.id,
        title: exp.title,
        description: exp.description,
        type: 'experience',
        url: `/experience#${exp.id}`,
        category: exp.category,
        tags: exp.skills || [],
        technologies: exp.technologies,
        relevance: 0,
        highlights: {},
        metadata: {
          startDate: exp.startDate,
          endDate: exp.endDate,
          role: exp.role,
        },
      });
    });

    // Add skills
    skills.skills.forEach((skill) => {
      searchData.push({
        id: skill.id,
        title: skill.name,
        description: skill.description,
        type: 'skill',
        url: `/skills#${skill.id}`,
        category: skill.category,
        tags: skill.tags || [],
        technologies: skill.technologies,
        relevance: 0,
        highlights: {},
        metadata: {
          publishedDate: skill.lastUpdated,
        },
      });
    });

    // Add person info
    searchData.push({
      id: 'person',
      title: person.name,
      description: person.bio,
      type: 'person',
      url: '/',
      category: 'personal',
      tags: person.skills || [],
      relevance: 0,
      highlights: {},
      metadata: {
        publishedDate: person.lastUpdated,
      },
    });

    // Cache the data
    searchDataCache = {
      data: searchData,
      timestamp: Date.now(),
    };

    return searchData;
  } catch (error) {
    console.error('Error loading search data:', error);
    throw new Error('Failed to load search data');
  }
}

/**
 * Highlight matched text in search results
 */
function highlightMatches(text: string, matches: Fuse.FuseResultMatch[]): string[] {
  if (!matches || matches.length === 0) return [text];

  const highlights: string[] = [];
  let lastIndex = 0;

  matches.forEach((match) => {
    match.indices.forEach(([start, end]) => {
      // Add text before the match
      if (start > lastIndex) {
        highlights.push(text.slice(lastIndex, start));
      }
      // Add highlighted match
      highlights.push(`<mark>${text.slice(start, end + 1)}</mark>`);
      lastIndex = end + 1;
    });
  });

  // Add remaining text
  if (lastIndex < text.length) {
    highlights.push(text.slice(lastIndex));
  }

  return highlights.filter(Boolean);
}

/**
 * Perform fuzzy search across all content
 */
export async function performFuzzySearch(
  query: string,
  options?: {
    limit?: number;
    type?: SearchResult['type'];
    category?: string;
  }
): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  try {
    const searchData = await loadSearchData();
    
    // Filter by type if specified
    let filteredData = searchData;
    if (options?.type) {
      filteredData = searchData.filter(item => item.type === options.type);
    }
    
    // Filter by category if specified
    if (options?.category) {
      filteredData = filteredData.filter(item => item.category === options.category);
    }

    // Create Fuse instance
    const fuse = new Fuse(filteredData, fuseOptions);
    
    // Perform search
    const results = fuse.search(query);
    
    // Process and format results
    const processedResults: SearchResult[] = results
      .slice(0, options?.limit || 20)
      .map((result) => {
        const item = result.item;
        const matches = result.matches || [];
        
        // Calculate relevance score (invert Fuse score and normalize)
        const relevance = result.score ? 1 - result.score : 0;
        
        // Extract highlights
        const highlights: SearchResult['highlights'] = {};
        
        matches.forEach((match) => {
          const key = match.key as keyof typeof item;
          if (key === 'title' && match.value) {
            highlights.title = highlightMatches(match.value, [match]);
          } else if (key === 'description' && match.value) {
            highlights.description = highlightMatches(match.value, [match]);
          } else if (key === 'tags' && Array.isArray(match.value)) {
            highlights.tags = match.value.map(tag => 
              typeof tag === 'string' ? `<mark>${tag}</mark>` : tag
            );
          } else if (key === 'technologies' && Array.isArray(match.value)) {
            highlights.technologies = match.value.map(tech => 
              typeof tech === 'object' ? `<mark>${tech.name}</mark>` : `<mark>${tech}</mark>`
            );
          }
        });

        return {
          ...item,
          relevance,
          highlights,
        };
      })
      .sort((a, b) => b.relevance - a.relevance); // Sort by relevance

    return processedResults;
  } catch (error) {
    console.error('Error performing fuzzy search:', error);
    throw new Error('Search failed');
  }
}

/**
 * Get search suggestions based on partial query
 */
export async function getSearchSuggestions(query: string): Promise<string[]> {
  if (!query.trim() || query.length < 2) return [];

  try {
    const searchData = await loadSearchData();
    const suggestions = new Set<string>();

    // Add titles that start with the query
    searchData.forEach((item) => {
      if (item.title.toLowerCase().startsWith(query.toLowerCase())) {
        suggestions.add(item.title);
      }
    });

    // Add tags that match the query
    searchData.forEach((item) => {
      item.tags?.forEach((tag) => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(tag);
        }
      });
    });

    // Add technology names that match the query
    searchData.forEach((item) => {
      item.technologies?.forEach((tech) => {
        if (tech.name.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(tech.name);
        }
      });
    });

    return Array.from(suggestions).slice(0, 10);
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
}

/**
 * Clear search cache
 */
export function clearSearchCache(): void {
  searchDataCache = null;
}

/**
 * Get search statistics
 */
export async function getSearchStats(): Promise<{
  totalItems: number;
  byType: Record<string, number>;
  lastUpdated: string;
}> {
  try {
    const searchData = await loadSearchData();
    const byType: Record<string, number> = {};
    
    searchData.forEach((item) => {
      byType[item.type] = (byType[item.type] || 0) + 1;
    });

    return {
      totalItems: searchData.length,
      byType,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting search stats:', error);
    return {
      totalItems: 0,
      byType: {},
      lastUpdated: new Date().toISOString(),
    };
  }
} 