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

// Technology stack validation
const technologySchema = z.object({
  name: z.string()
    .min(1, 'Technology name is required')
    .max(50, 'Technology name must be less than 50 characters'),
  category: z.enum(['frontend', 'backend', 'database', 'devops', 'mobile', 'ai-ml', 'other'], {
    errorMap: () => ({ message: 'Category must be one of: frontend, backend, database, devops, mobile, ai-ml, other' })
  }),
  version: z.string().max(20, 'Version must be less than 20 characters').optional(),
  icon: z.string().url('Icon must be a valid URL').optional(),
});

// Project metrics validation
const projectMetricsSchema = z.object({
  users: z.number().int().min(0, 'Users must be a non-negative integer').optional(),
  transactions: z.number().int().min(0, 'Transactions must be a non-negative integer').optional(),
  performance: z.string().max(100, 'Performance metric must be less than 100 characters').optional(),
  uptime: z.string().max(50, 'Uptime must be less than 50 characters').optional(),
  cost: z.string().max(50, 'Cost metric must be less than 50 characters').optional(),
});

// Project link validation
const projectLinkSchema = z.object({
  label: z.string()
    .min(1, 'Link label is required')
    .max(50, 'Link label must be less than 50 characters'),
  url: urlSchema,
  type: z.enum(['demo', 'github', 'documentation', 'case-study', 'other'], {
    errorMap: () => ({ message: 'Link type must be one of: demo, github, documentation, case-study, other' })
  }),
  external: z.boolean().default(true),
});

// Project content schema
export const ProjectContentSchema = z.object({
  id: z.string()
    .min(1, 'ID is required and cannot be empty')
    .max(100, 'ID must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'ID must contain only lowercase letters, numbers, and hyphens'),
  
  title: z.string()
    .min(1, 'Title is required and cannot be empty')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  
  shortDescription: z.string()
    .min(5, 'Short description must be at least 5 characters long')
    .max(150, 'Short description must be less than 150 characters')
    .trim(),
  
  category: z.enum(['web-app', 'mobile-app', 'api', 'ecommerce', 'fintech', 'saas', 'open-source', 'other'], {
    errorMap: () => ({ message: 'Category must be one of: web-app, mobile-app, api, ecommerce, fintech, saas, open-source, other' })
  }),
  
  client: z.string()
    .min(1, 'Client name is required')
    .max(100, 'Client name must be less than 100 characters')
    .trim(),
  
  technologies: z.array(technologySchema)
    .min(1, 'At least one technology is required')
    .max(20, 'Maximum 20 technologies allowed'),
  
  startDate: z.string()
    .datetime('Start date must be a valid ISO 8601 datetime string')
    .refine(
      (date) => {
        const dateObj = new Date(date);
        return !isNaN(dateObj.getTime());
      },
      { message: 'Start date must be a valid date' }
    ),
  
  endDate: z.string()
    .datetime('End date must be a valid ISO 8601 datetime string')
    .optional(),
  
  status: z.enum(['completed', 'in-progress', 'on-hold', 'archived'], {
    errorMap: () => ({ message: 'Status must be one of: completed, in-progress, on-hold, archived' })
  }),
  
  featured: z.boolean().default(false),
  
  thumbnail: z.string()
    .url('Thumbnail must be a valid URL')
    .refine(
      (url) => {
        try {
          const urlObj = new URL(url);
          return ['http:', 'https:'].includes(urlObj.protocol);
        } catch {
          return false;
        }
      },
      { message: 'Thumbnail URL must be a valid HTTP or HTTPS URL' }
    )
    .optional(),
  
  images: z.array(z.string().url('Image URL must be valid'))
    .max(10, 'Maximum 10 images allowed')
    .optional(),
  
  metrics: projectMetricsSchema.optional(),
  
  caseStudy: z.object({
    overview: z.string()
      .min(20, 'Case study overview must be at least 20 characters long')
      .max(1000, 'Case study overview must be less than 1000 characters')
      .trim(),
    
    challenge: z.string()
      .min(20, 'Challenge description must be at least 20 characters long')
      .max(500, 'Challenge description must be less than 500 characters')
      .trim(),
    
    solution: z.string()
      .min(20, 'Solution description must be at least 20 characters long')
      .max(500, 'Solution description must be less than 500 characters')
      .trim(),
    
    results: z.string()
      .min(20, 'Results description must be at least 20 characters long')
      .max(500, 'Results description must be less than 500 characters')
      .trim(),
    
    lessons: z.array(z.string().min(10, 'Lesson must be at least 10 characters long'))
      .max(5, 'Maximum 5 lessons allowed')
      .optional(),
  }).optional(),
  
  links: z.array(projectLinkSchema)
    .max(10, 'Maximum 10 links allowed')
    .optional(),
  
  teamSize: z.number()
    .int('Team size must be a whole number')
    .min(1, 'Team size must be at least 1')
    .max(100, 'Team size cannot exceed 100')
    .optional(),
  
  role: z.string()
    .min(1, 'Role is required')
    .max(100, 'Role must be less than 100 characters')
    .trim(),
  
  responsibilities: z.array(z.string().min(10, 'Responsibility must be at least 10 characters long'))
    .max(10, 'Maximum 10 responsibilities allowed')
    .optional(),
  
  metaTitle: z.string()
    .max(60, 'Meta title must be less than 60 characters')
    .optional(),
  
  metaDescription: z.string()
    .max(160, 'Meta description must be less than 160 characters')
    .optional(),
  
  socialImage: z.string()
    .url('Social image must be a valid URL')
    .optional(),
  
  trackingId: z.string()
    .max(100, 'Tracking ID must be less than 100 characters')
    .optional(),
});

// Projects page data schema
export const ProjectsPageDataSchema = z.object({
  title: z.string()
    .min(1, 'Page title is required')
    .max(100, 'Page title must be less than 100 characters'),
  
  description: z.string()
    .min(10, 'Page description must be at least 10 characters long')
    .max(500, 'Page description must be less than 500 characters'),
  
  metaTitle: z.string()
    .max(60, 'Meta title must be less than 60 characters'),
  
  metaDescription: z.string()
    .max(160, 'Meta description must be less than 160 characters'),
  
  socialImage: z.string()
    .url('Social image must be a valid URL')
    .optional(),
  
  lastUpdated: z.string()
    .datetime('Last updated must be a valid ISO 8601 datetime string'),
  
  trackingEnabled: z.boolean().default(true),
  
  projects: z.array(ProjectContentSchema)
    .min(1, 'At least one project is required'),
});

// Export TypeScript types
export type ProjectContent = z.infer<typeof ProjectContentSchema>;
export type ProjectsPageData = z.infer<typeof ProjectsPageDataSchema>;
export type Technology = z.infer<typeof technologySchema>;
export type ProjectMetrics = z.infer<typeof projectMetricsSchema>;
export type ProjectLink = z.infer<typeof projectLinkSchema>; 