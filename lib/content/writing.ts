import { promises as fs } from 'fs';
import path from 'path';
import { WritingPageDataSchema, WritingPageData } from '../../schemas/writing';

/**
 * Load writing content from JSON file with Zod validation
 * @returns Promise<WritingPageData> - Validated writing page data
 * @throws Error - If file cannot be read or validation fails
 */
export async function loadWritingContent(): Promise<WritingPageData> {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'writing.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const jsonData = JSON.parse(rawData);
    
    // Validate data with Zod schema
    const validatedData = WritingPageDataSchema.parse(jsonData);
    
    return validatedData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load writing content: ${error.message}`);
    }
    throw new Error('Failed to load writing content: Unknown error');
  }
}

/**
 * Get featured writings from the content
 * @param writings - Array of writing content
 * @returns WritingContent[] - Featured writings only
 */
export function getFeaturedWritings(writings: WritingPageData['writings']) {
  return writings.filter(writing => writing.featured);
}

/**
 * Filter writings by type
 * @param writings - Array of writing content
 * @param type - Type to filter by
 * @returns WritingContent[] - Filtered writings
 */
export function filterWritingsByType(
  writings: WritingPageData['writings'], 
  type: 'external' | 'iframe' | 'blog'
) {
  return writings.filter(writing => writing.type === type);
}

/**
 * Sort writings by published date (newest first)
 * @param writings - Array of writing content
 * @returns WritingContent[] - Sorted writings
 */
export function sortWritingsByDate(writings: WritingPageData['writings']) {
  return [...writings].sort((a, b) => 
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
} 