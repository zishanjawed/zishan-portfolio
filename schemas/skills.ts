import { z } from 'zod';

// URL validation with protocol check
const urlSchema = z.string().url('Valid URL is required').refine(
  (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
    } catch {
      return false;
    }
  },
  { message: 'URL must be a valid HTTP or HTTPS URL' }
);

// Skill category validation
const skillCategorySchema = z.object({
  id: z.string()
    .min(1, 'Category ID is required')
    .max(50, 'Category ID must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Category ID must contain only lowercase letters, numbers, and hyphens'),
  
  name: z.string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be less than 100 characters')
    .trim(),
  
  description: z.string()
    .min(10, 'Category description must be at least 10 characters long')
    .max(500, 'Category description must be less than 500 characters')
    .trim(),
  
  icon: z.string()
    .url('Category icon must be a valid URL')
    .optional(),
  
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color code')
    .optional(),
  
  order: z.number()
    .int('Order must be a whole number')
    .min(0, 'Order cannot be negative')
    .max(100, 'Order cannot exceed 100'),
});

// Individual skill validation
const skillSchema = z.object({
  id: z.string()
    .min(1, 'Skill ID is required')
    .max(50, 'Skill ID must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Skill ID must contain only lowercase letters, numbers, and hyphens'),
  
  name: z.string()
    .min(1, 'Skill name is required')
    .max(100, 'Skill name must be less than 100 characters')
    .trim(),
  
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters')
    .trim(),
  
  proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert'], {
    errorMap: () => ({ message: 'Proficiency must be one of: beginner, intermediate, advanced, expert' })
  }),
  
  yearsOfExperience: z.number()
    .int('Years of experience must be a whole number')
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Years of experience cannot exceed 50'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .optional(),
  
  icon: z.string()
    .url('Skill icon must be a valid URL')
    .optional(),
  
  logo: z.string()
    .url('Skill logo must be a valid URL')
    .optional(),
  
  website: urlSchema.optional(),
  
  documentation: urlSchema.optional(),
  
  projects: z.array(z.string())
    .max(10, 'Maximum 10 project references allowed')
    .optional(),
  
  certifications: z.array(z.string())
    .max(5, 'Maximum 5 certification references allowed')
    .optional(),
  
  featured: z.boolean().default(false),
  
  order: z.number()
    .int('Order must be a whole number')
    .min(0, 'Order cannot be negative')
    .max(100, 'Order cannot exceed 100'),
  
  tags: z.array(z.string())
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  
  lastUsed: z.string()
    .datetime('Last used date must be a valid ISO 8601 datetime string')
    .optional(),
});

// Skill level validation
const skillLevelSchema = z.object({
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'], {
    errorMap: () => ({ message: 'Level must be one of: beginner, intermediate, advanced, expert' })
  }),
  description: z.string()
    .min(10, 'Level description must be at least 10 characters long')
    .max(200, 'Level description must be less than 200 characters')
    .trim(),
  yearsRange: z.object({
    min: z.number()
      .int('Minimum years must be a whole number')
      .min(0, 'Minimum years cannot be negative')
      .max(50, 'Minimum years cannot exceed 50'),
    max: z.number()
      .int('Maximum years must be a whole number')
      .min(0, 'Maximum years cannot be negative')
      .max(50, 'Maximum years cannot exceed 50'),
  }),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color code'),
});

// Skills content schema
export const SkillsContentSchema = z.object({
  // Page Information
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  
  // Skill Categories
  categories: z.array(skillCategorySchema)
    .min(1, 'At least one category is required')
    .max(20, 'Maximum 20 categories allowed'),
  
  // Skills
  skills: z.array(skillSchema)
    .min(1, 'At least one skill is required')
    .max(200, 'Maximum 200 skills allowed'),
  
  // Skill Levels
  levels: z.array(skillLevelSchema)
    .min(1, 'At least one skill level is required')
    .max(10, 'Maximum 10 skill levels allowed'),
  
  // Summary Statistics
  summary: z.object({
    totalSkills: z.number()
      .int('Total skills must be a whole number')
      .min(0, 'Total skills cannot be negative'),
    categories: z.number()
      .int('Categories count must be a whole number')
      .min(0, 'Categories count cannot be negative'),
    yearsOfExperience: z.number()
      .int('Years of experience must be a whole number')
      .min(0, 'Years of experience cannot be negative')
      .max(50, 'Years of experience cannot exceed 50'),
    expertSkills: z.number()
      .int('Expert skills count must be a whole number')
      .min(0, 'Expert skills count cannot be negative'),
    advancedSkills: z.number()
      .int('Advanced skills count must be a whole number')
      .min(0, 'Advanced skills count cannot be negative'),
    intermediateSkills: z.number()
      .int('Intermediate skills count must be a whole number')
      .min(0, 'Intermediate skills count cannot be negative'),
    beginnerSkills: z.number()
      .int('Beginner skills count must be a whole number')
      .min(0, 'Beginner skills count cannot be negative'),
  }),
  
  // Featured Skills
  featuredSkills: z.array(z.string())
    .max(20, 'Maximum 20 featured skills allowed')
    .optional(),
  
  // Skills by Category
  skillsByCategory: z.record(z.string(), z.array(z.string()))
    .optional(),
  
  // SEO and Metadata
  metaTitle: z.string()
    .min(1, 'Meta title is required')
    .max(60, 'Meta title must be less than 60 characters')
    .trim(),
  
  metaDescription: z.string()
    .min(1, 'Meta description is required')
    .max(160, 'Meta description must be less than 160 characters')
    .trim(),
  
  socialImage: z.string()
    .url('Social image must be a valid URL')
    .optional(),
  
  // Tracking
  trackingEnabled: z.boolean().default(true),
  
  // Timestamps
  lastUpdated: z.string()
    .datetime('Last updated must be a valid ISO 8601 datetime string'),
});

// Skills page data schema (wrapper for the content)
export const SkillsPageDataSchema = z.object({
  skills: SkillsContentSchema,
});

// Export TypeScript types
export type SkillsContent = z.infer<typeof SkillsContentSchema>;
export type SkillsPageData = z.infer<typeof SkillsPageDataSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type Skill = z.infer<typeof skillSchema>;
export type SkillLevel = z.infer<typeof skillLevelSchema>; 