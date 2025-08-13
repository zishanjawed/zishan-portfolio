import { promises as fs } from 'fs';
import path from 'path';

// Import all schemas
import { PersonPageDataSchema, PersonPageData } from '../../schemas/person';
import { ExperiencePageDataSchema, ExperiencePageData } from '../../schemas/experience';
import { SkillsPageDataSchema, SkillsPageData } from '../../schemas/skills';
import { ProjectsPageDataSchema, ProjectsPageData } from '../../schemas/projects';
import { WritingPageDataSchema, WritingPageData } from '../../schemas/writing';

// Content cache for performance optimization
const contentCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Generic content loader with caching and validation
 * @param filePath - Path to the JSON file
 * @param schema - Zod schema for validation
 * @param cacheKey - Cache key for the content
 * @returns Promise<T> - Validated content data
 * @throws Error - If file cannot be read or validation fails
 */
async function loadContentWithCache<T>(
  filePath: string,
  schema: any,
  cacheKey: string
): Promise<T> {
  try {
    // Check cache first
    const cached = contentCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data as T;
    }

    // Load and parse file
    const rawData = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(rawData);
    
    // Validate data with Zod schema
    const validatedData = schema.parse(jsonData);
    
    // Cache the validated data
    contentCache.set(cacheKey, {
      data: validatedData,
      timestamp: Date.now()
    });
    
    return validatedData as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load content from ${filePath}: ${error.message}`);
    }
    throw new Error(`Failed to load content from ${filePath}: Unknown error`);
  }
}

/**
 * Clear content cache
 */
export function clearContentCache(): void {
  contentCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: contentCache.size,
    keys: Array.from(contentCache.keys())
  };
}

/**
 * Load person content from JSON file with Zod validation
 * @returns Promise<PersonPageData> - Validated person page data
 * @throws Error - If file cannot be read or validation fails
 */
export async function loadPersonContent(): Promise<PersonPageData> {
  const dataPath = path.join(process.cwd(), 'data', 'person.json');
  return loadContentWithCache<PersonPageData>(dataPath, PersonPageDataSchema, 'person');
}

/**
 * Load experience content from JSON file with Zod validation
 * @returns Promise<ExperiencePageData> - Validated experience page data
 * @throws Error - If file cannot be read or validation fails
 */
export async function loadExperienceContent(): Promise<ExperiencePageData> {
  const dataPath = path.join(process.cwd(), 'data', 'experience.json');
  return loadContentWithCache<ExperiencePageData>(dataPath, ExperiencePageDataSchema, 'experience');
}

/**
 * Load skills content from JSON file with Zod validation
 * @returns Promise<SkillsPageData> - Validated skills page data
 * @throws Error - If file cannot be read or validation fails
 */
export async function loadSkillsContent(): Promise<SkillsPageData> {
  const dataPath = path.join(process.cwd(), 'data', 'skills.json');
  return loadContentWithCache<SkillsPageData>(dataPath, SkillsPageDataSchema, 'skills');
}

/**
 * Load projects content from JSON file with Zod validation
 * @returns Promise<ProjectsPageData> - Validated projects page data
 * @throws Error - If file cannot be read or validation fails
 */
export async function loadProjectsContent(): Promise<ProjectsPageData> {
  const dataPath = path.join(process.cwd(), 'data', 'projects.json');
  return loadContentWithCache<ProjectsPageData>(dataPath, ProjectsPageDataSchema, 'projects');
}

/**
 * Load writing content from JSON file with Zod validation
 * @returns Promise<WritingPageData> - Validated writing page data
 * @throws Error - If file cannot be read or validation fails
 */
export async function loadWritingContent(): Promise<WritingPageData> {
  const dataPath = path.join(process.cwd(), 'data', 'writing.json');
  return loadContentWithCache<WritingPageData>(dataPath, WritingPageDataSchema, 'writing');
}

/**
 * Load all content types at once
 * @returns Promise<AllContentData> - All validated content data
 * @throws Error - If any file cannot be read or validation fails
 */
export async function loadAllContent(): Promise<{
  person: PersonPageData;
  experience: ExperiencePageData;
  skills: SkillsPageData;
  projects: ProjectsPageData;
  writing: WritingPageData;
}> {
  try {
    const [person, experience, skills, projects, writing] = await Promise.all([
      loadPersonContent(),
      loadExperienceContent(),
      loadSkillsContent(),
      loadProjectsContent(),
      loadWritingContent(),
    ]);

    return {
      person,
      experience,
      skills,
      projects,
      writing,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load all content: ${error.message}`);
    }
    throw new Error('Failed to load all content: Unknown error');
  }
}

/**
 * Validate content without loading from file
 * @param content - Raw content data to validate
 * @param schema - Zod schema for validation
 * @returns T - Validated content data
 * @throws Error - If validation fails
 */
export function validateContent<T>(content: any, schema: any): T {
  try {
    return schema.parse(content) as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Content validation failed: ${error.message}`);
    }
    throw new Error('Content validation failed: Unknown error');
  }
}

/**
 * Check if content file exists
 * @param contentType - Type of content to check
 * @returns Promise<boolean> - Whether the file exists
 */
export async function contentFileExists(contentType: string): Promise<boolean> {
  try {
    const dataPath = path.join(process.cwd(), 'data', `${contentType}.json`);
    await fs.access(dataPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get content file path
 * @param contentType - Type of content
 * @returns string - Full path to the content file
 */
export function getContentFilePath(contentType: string): string {
  return path.join(process.cwd(), 'data', `${contentType}.json`);
}

/**
 * Get content file modification time
 * @param contentType - Type of content
 * @returns Promise<Date | null> - File modification time or null if file doesn't exist
 */
export async function getContentFileModTime(contentType: string): Promise<Date | null> {
  try {
    const dataPath = getContentFilePath(contentType);
    const stats = await fs.stat(dataPath);
    return stats.mtime;
  } catch {
    return null;
  }
}

// Export types for convenience
export type {
  PersonPageData,
  ExperiencePageData,
  SkillsPageData,
  ProjectsPageData,
  WritingPageData,
}; 