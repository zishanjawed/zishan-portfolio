import { z } from 'zod';

// Platform-specific validation rules
const PLATFORM_DOMAINS = {
  medium: ['medium.com', 'medium.tech'],
  devto: ['dev.to', 'dev.to'],
  github: ['github.com', 'gist.github.com'],
  personal: ['zishan.loopcraftlab.com', 'blog.zishan.dev'],
  substack: ['substack.com'],
  hashnode: ['hashnode.dev'],
} as const;

// URL validation with platform-specific rules
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

// Platform validation based on URL
const platformSchema = z.enum(['Medium', 'Dev.to', 'GitHub', 'Personal Blog', 'Substack', 'Hashnode', 'Other'], {
  errorMap: () => ({ message: 'Platform must be one of: Medium, Dev.to, GitHub, Personal Blog, Substack, Hashnode, Other' })
});

// Enhanced writing content schema with comprehensive validation
export const WritingContentSchema = z.object({
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
  
  url: urlSchema,
  
  type: z.enum(['external', 'iframe', 'blog'], {
    errorMap: () => ({ message: 'Type must be one of: external, iframe, or blog' })
  }),
  
  publishedDate: z.string()
    .datetime('Published date must be a valid ISO 8601 datetime string (e.g., 2024-12-15T10:00:00Z)')
    .refine(
      (date) => {
        const dateObj = new Date(date);
        return !isNaN(dateObj.getTime()) && dateObj <= new Date();
      },
      { message: 'Published date must be a valid date in the past or present' }
    ),
  
  readTime: z.number()
    .int('Read time must be a whole number')
    .min(1, 'Read time must be at least 1 minute')
    .max(480, 'Read time cannot exceed 8 hours (480 minutes)')
    .optional(),
  
  tags: z.array(
    z.string()
      .min(1, 'Tag cannot be empty')
      .max(50, 'Tag must be less than 50 characters')
      .regex(/^[a-zA-Z0-9\s-]+$/, 'Tag can only contain letters, numbers, spaces, and hyphens')
  )
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  
  featured: z.boolean().optional(),
  
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
  
  author: z.string()
    .min(1, 'Author name cannot be empty')
    .max(100, 'Author name must be less than 100 characters')
    .trim()
    .optional(),
  
  source: z.string()
    .min(1, 'Source cannot be empty')
    .max(100, 'Source must be less than 100 characters')
    .trim()
    .optional(),
  
  // Platform-specific validation
  platform: platformSchema.optional(),
  
  // Additional metadata
  language: z.enum(['en', 'es', 'fr', 'de', 'pt', 'other'], {
    errorMap: () => ({ message: 'Language must be one of: en, es, fr, de, pt, other' })
  }).default('en'),
  
  category: z.enum(['fintech', 'backend', 'frontend', 'devops', 'architecture', 'performance', 'security', 'other'], {
    errorMap: () => ({ message: 'Category must be one of: fintech, backend, frontend, devops, architecture, performance, security, other' })
  }).optional(),
  
  // SEO metadata
  metaTitle: z.string()
    .max(60, 'Meta title must be less than 60 characters for SEO')
    .optional(),
  
  metaDescription: z.string()
    .max(160, 'Meta description must be less than 160 characters for SEO')
    .optional(),
  
  // Social sharing
  socialImage: z.string().url('Social image must be a valid URL').optional(),
  
  // Analytics tracking
  trackingId: z.string()
    .regex(/^[a-zA-Z0-9_-]+$/, 'Tracking ID can only contain letters, numbers, underscores, and hyphens')
    .optional(),
}).refine(
  (data) => {
    // Cross-field validation: if type is iframe, thumbnail should be provided
    if (data.type === 'iframe' && !data.thumbnail) {
      return false;
    }
    return true;
  },
  {
    message: 'Iframe type writings must include a thumbnail image',
    path: ['thumbnail']
  }
).refine(
  (data) => {
    // Cross-field validation: featured writings should have tags
    if (data.featured && (!data.tags || data.tags.length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Featured writings should include tags for better categorization',
    path: ['tags']
  }
);

// Enhanced page data schema
export const WritingPageDataSchema = z.object({
  title: z.string()
    .min(1, 'Page title is required and cannot be empty')
    .max(100, 'Page title must be less than 100 characters')
    .trim(),
  
  description: z.string()
    .min(10, 'Page description must be at least 10 characters long')
    .max(300, 'Page description must be less than 300 characters')
    .trim(),
  
  writings: z.array(WritingContentSchema)
    .min(1, 'At least one writing item is required')
    .max(100, 'Maximum 100 writing items allowed'),
  
  totalCount: z.number()
    .int('Total count must be a whole number')
    .min(0, 'Total count must be non-negative')
    .refine(
      (count) => count >= 0,
      { message: 'Total count cannot be negative' }
    ),
  
  // Page-level metadata
  lastUpdated: z.string()
    .datetime('Last updated must be a valid ISO 8601 datetime string')
    .optional(),
  
  // SEO metadata
  metaTitle: z.string()
    .max(60, 'Page meta title must be less than 60 characters for SEO')
    .optional(),
  
  metaDescription: z.string()
    .max(160, 'Page meta description must be less than 160 characters for SEO')
    .optional(),
  
  // Social sharing
  socialImage: z.string().url('Page social image must be a valid URL').optional(),
  
  // Analytics
  trackingEnabled: z.boolean().default(true),
}).refine(
  (data) => {
    // Cross-field validation: totalCount should match actual writings length
    return data.totalCount === data.writings.length;
  },
  {
    message: 'Total count must match the actual number of writing items',
    path: ['totalCount']
  }
);

// Export TypeScript types
export type WritingContent = z.infer<typeof WritingContentSchema>;
export type WritingPageData = z.infer<typeof WritingPageDataSchema>;

// Platform type for better type safety
export type Platform = z.infer<typeof platformSchema>;

// Validation utilities
export const validateWritingContent = (data: unknown): { success: boolean; data?: WritingContent; error?: string } => {
  try {
    const validated = WritingContentSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown validation error' };
  }
};

export const validateWritingPageData = (data: unknown): { success: boolean; data?: WritingPageData; error?: string } => {
  try {
    const validated = WritingPageDataSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown validation error' };
  }
};

// Safe validation (returns null on error instead of throwing)
export const safeValidateWritingContent = (data: unknown): WritingContent | null => {
  try {
    return WritingContentSchema.parse(data);
  } catch {
    return null;
  }
};

export const safeValidateWritingPageData = (data: unknown): WritingPageData | null => {
  try {
    return WritingPageDataSchema.parse(data);
  } catch {
    return null;
  }
}; 