import { z } from 'zod';

export const WritingContentSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  url: z.string().url('Valid URL is required'),
  type: z.enum(['external', 'iframe', 'blog'], {
    errorMap: () => ({ message: 'Type must be external, iframe, or blog' })
  }),
  publishedDate: z.string().datetime('Published date must be a valid ISO date'),
  readTime: z.number().min(1).max(480).optional(), // 1 minute to 8 hours
  tags: z.array(z.string().min(1)).max(10).optional(), // Max 10 tags
  featured: z.boolean().optional(),
  thumbnail: z.string().url().optional(),
  author: z.string().min(1).max(100).optional(),
  source: z.string().min(1).max(100).optional(),
});

export const WritingPageDataSchema = z.object({
  title: z.string().min(1, 'Page title is required').max(100, 'Page title must be less than 100 characters'),
  description: z.string().min(1, 'Page description is required').max(300, 'Page description must be less than 300 characters'),
  writings: z.array(WritingContentSchema).min(1, 'At least one writing item is required'),
  totalCount: z.number().int().min(0, 'Total count must be non-negative'),
});

export type WritingContent = z.infer<typeof WritingContentSchema>;
export type WritingPageData = z.infer<typeof WritingPageDataSchema>; 