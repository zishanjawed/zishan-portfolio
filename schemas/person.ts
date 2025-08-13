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

// Email validation
const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email must be less than 255 characters')
  .trim()
  .toLowerCase();

// Social media link validation
const socialLinkSchema = z.object({
  platform: z.enum(['github', 'linkedin', 'twitter', 'medium', 'devto', 'personal', 'other'], {
    errorMap: () => ({ message: 'Platform must be one of: github, linkedin, twitter, medium, devto, personal, other' })
  }),
  url: urlSchema,
  username: z.string()
    .min(1, 'Username is required')
    .max(100, 'Username must be less than 100 characters')
    .trim(),
  displayName: z.string()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be less than 100 characters')
    .trim(),
  verified: z.boolean().default(false),
});

// Skill validation
const skillSchema = z.object({
  name: z.string()
    .min(1, 'Skill name is required')
    .max(100, 'Skill name must be less than 100 characters')
    .trim(),
  category: z.enum(['programming', 'framework', 'database', 'cloud', 'devops', 'tool', 'language', 'other'], {
    errorMap: () => ({ message: 'Category must be one of: programming, framework, database, cloud, devops, tool, language, other' })
  }),
  proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert'], {
    errorMap: () => ({ message: 'Proficiency must be one of: beginner, intermediate, advanced, expert' })
  }),
  yearsOfExperience: z.number()
    .int('Years of experience must be a whole number')
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Years of experience cannot exceed 50')
    .optional(),
  icon: z.string().url('Icon must be a valid URL').optional(),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .trim()
    .optional(),
});

// Availability status validation
const availabilitySchema = z.object({
  status: z.enum(['available', 'busy', 'unavailable', 'part-time'], {
    errorMap: () => ({ message: 'Status must be one of: available, busy, unavailable, part-time' })
  }),
  message: z.string()
    .max(200, 'Availability message must be less than 200 characters')
    .trim()
    .optional(),
  availableFrom: z.string()
    .datetime('Available from date must be a valid ISO 8601 datetime string')
    .optional(),
  responseTime: z.string()
    .max(50, 'Response time must be less than 50 characters')
    .trim()
    .optional(),
});

// Person content schema
export const PersonContentSchema = z.object({
  // Basic Information
  name: z.string()
    .min(1, 'Name is required and cannot be empty')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  
  title: z.string()
    .min(1, 'Title is required and cannot be empty')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  
  email: emailSchema,
  
  phone: z.string()
    .max(20, 'Phone number must be less than 20 characters')
    .trim()
    .optional(),
  
  // Professional Information
  summary: z.string()
    .min(10, 'Summary must be at least 10 characters long')
    .max(1000, 'Summary must be less than 1000 characters')
    .trim(),
  
  bio: z.string()
    .min(50, 'Bio must be at least 50 characters long')
    .max(2000, 'Bio must be less than 2000 characters')
    .trim()
    .optional(),
  
  // Location
  location: z.object({
    city: z.string()
      .min(1, 'City is required')
      .max(100, 'City must be less than 100 characters')
      .trim(),
    country: z.string()
      .min(1, 'Country is required')
      .max(100, 'Country must be less than 100 characters')
      .trim(),
    timezone: z.string()
      .max(50, 'Timezone must be less than 50 characters')
      .trim()
      .optional(),
  }),
  
  // Social Links
  social: z.array(socialLinkSchema)
    .min(1, 'At least one social link is required')
    .max(10, 'Maximum 10 social links allowed'),
  
  // Skills
  skills: z.array(skillSchema)
    .min(1, 'At least one skill is required')
    .max(50, 'Maximum 50 skills allowed'),
  
  // Availability
  availability: availabilitySchema.optional(),
  
  // Professional Details
  experience: z.object({
    years: z.number()
      .int('Years of experience must be a whole number')
      .min(0, 'Years of experience cannot be negative')
      .max(50, 'Years of experience cannot exceed 50'),
    focus: z.array(z.string())
      .min(1, 'At least one focus area is required')
      .max(10, 'Maximum 10 focus areas allowed'),
  }),
  
  // Images
  avatar: z.string()
    .url('Avatar must be a valid URL')
    .optional(),
  
  banner: z.string()
    .url('Banner must be a valid URL')
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

// Person page data schema (wrapper for the content)
export const PersonPageDataSchema = z.object({
  person: PersonContentSchema,
});

// Export TypeScript types
export type PersonContent = z.infer<typeof PersonContentSchema>;
export type PersonPageData = z.infer<typeof PersonPageDataSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Availability = z.infer<typeof availabilitySchema>; 