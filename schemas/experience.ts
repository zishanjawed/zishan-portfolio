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

// Technology validation for experience entries
const technologySchema = z.object({
  name: z.string()
    .min(1, 'Technology name is required')
    .max(100, 'Technology name must be less than 100 characters')
    .trim(),
  category: z.enum(['frontend', 'backend', 'database', 'devops', 'mobile', 'ai-ml', 'other'], {
    errorMap: () => ({ message: 'Category must be one of: frontend, backend, database, devops, mobile, ai-ml, other' })
  }),
  version: z.string().max(20, 'Version must be less than 20 characters').optional(),
});

// Achievement validation
const achievementSchema = z.object({
  title: z.string()
    .min(1, 'Achievement title is required')
    .max(200, 'Achievement title must be less than 200 characters')
    .trim(),
  description: z.string()
    .min(10, 'Achievement description must be at least 10 characters long')
    .max(500, 'Achievement description must be less than 500 characters')
    .trim(),
  impact: z.string()
    .max(200, 'Impact description must be less than 200 characters')
    .trim()
    .optional(),
  date: z.string()
    .datetime('Achievement date must be a valid ISO 8601 datetime string')
    .optional(),
});

// Work experience entry schema
const workExperienceSchema = z.object({
  id: z.string()
    .min(1, 'ID is required and cannot be empty')
    .max(100, 'ID must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'ID must contain only lowercase letters, numbers, and hyphens'),
  
  company: z.string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be less than 200 characters')
    .trim(),
  
  position: z.string()
    .min(1, 'Position title is required')
    .max(200, 'Position title must be less than 200 characters')
    .trim(),
  
  location: z.string()
    .min(1, 'Location is required')
    .max(200, 'Location must be less than 200 characters')
    .trim(),
  
  startDate: z.string()
    .datetime('Start date must be a valid ISO 8601 datetime string'),
  
  endDate: z.string()
    .datetime('End date must be a valid ISO 8601 datetime string')
    .optional(),
  
  current: z.boolean().default(false),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters long')
    .max(1000, 'Description must be less than 1000 characters')
    .trim(),
  
  responsibilities: z.array(z.string())
    .min(1, 'At least one responsibility is required')
    .max(20, 'Maximum 20 responsibilities allowed'),
  
  technologies: z.array(technologySchema)
    .min(1, 'At least one technology is required')
    .max(30, 'Maximum 30 technologies allowed'),
  
  achievements: z.array(achievementSchema)
    .max(10, 'Maximum 10 achievements allowed')
    .optional(),
  
  companyUrl: urlSchema.optional(),
  
  companyLogo: z.string()
    .url('Company logo must be a valid URL')
    .optional(),
  
  industry: z.string()
    .min(1, 'Industry is required')
    .max(100, 'Industry must be less than 100 characters')
    .trim(),
  
  teamSize: z.number()
    .int('Team size must be a whole number')
    .min(1, 'Team size must be at least 1')
    .max(1000, 'Team size cannot exceed 1000')
    .optional(),
  
  projectType: z.enum(['full-time', 'contract', 'freelance', 'part-time', 'internship'], {
    errorMap: () => ({ message: 'Project type must be one of: full-time, contract, freelance, part-time, internship' })
  }),
  
  featured: z.boolean().default(false),
});

// Education entry schema
const educationSchema = z.object({
  id: z.string()
    .min(1, 'ID is required and cannot be empty')
    .max(100, 'ID must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'ID must contain only lowercase letters, numbers, and hyphens'),
  
  institution: z.string()
    .min(1, 'Institution name is required')
    .max(200, 'Institution name must be less than 200 characters')
    .trim(),
  
  degree: z.string()
    .min(1, 'Degree is required')
    .max(200, 'Degree must be less than 200 characters')
    .trim(),
  
  field: z.string()
    .min(1, 'Field of study is required')
    .max(200, 'Field of study must be less than 200 characters')
    .trim(),
  
  startDate: z.string()
    .datetime('Start date must be a valid ISO 8601 datetime string'),
  
  endDate: z.string()
    .datetime('End date must be a valid ISO 8601 datetime string')
    .optional(),
  
  current: z.boolean().default(false),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .optional(),
  
  gpa: z.number()
    .min(0, 'GPA cannot be negative')
    .max(4.0, 'GPA cannot exceed 4.0')
    .optional(),
  
  achievements: z.array(z.string())
    .max(10, 'Maximum 10 achievements allowed')
    .optional(),
  
  institutionUrl: urlSchema.optional(),
  
  location: z.string()
    .min(1, 'Location is required')
    .max(200, 'Location must be less than 200 characters')
    .trim(),
  
  featured: z.boolean().default(false),
});

// Certification entry schema
const certificationSchema = z.object({
  id: z.string()
    .min(1, 'ID is required and cannot be empty')
    .max(100, 'ID must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'ID must contain only lowercase letters, numbers, and hyphens'),
  
  name: z.string()
    .min(1, 'Certification name is required')
    .max(200, 'Certification name must be less than 200 characters')
    .trim(),
  
  issuer: z.string()
    .min(1, 'Issuer is required')
    .max(200, 'Issuer must be less than 200 characters')
    .trim(),
  
  issueDate: z.string()
    .datetime('Issue date must be a valid ISO 8601 datetime string'),
  
  expiryDate: z.string()
    .datetime('Expiry date must be a valid ISO 8601 datetime string')
    .optional(),
  
  credentialId: z.string()
    .max(100, 'Credential ID must be less than 100 characters')
    .trim()
    .optional(),
  
  credentialUrl: urlSchema.optional(),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .optional(),
  
  featured: z.boolean().default(false),
});

// Experience content schema
export const ExperienceContentSchema = z.object({
  // Work Experience
  workExperience: z.array(workExperienceSchema)
    .min(1, 'At least one work experience entry is required')
    .max(50, 'Maximum 50 work experience entries allowed'),
  
  // Education
  education: z.array(educationSchema)
    .min(1, 'At least one education entry is required')
    .max(20, 'Maximum 20 education entries allowed'),
  
  // Certifications
  certifications: z.array(certificationSchema)
    .max(30, 'Maximum 30 certifications allowed')
    .optional(),
  
  // Summary
  summary: z.string()
    .min(10, 'Summary must be at least 10 characters long')
    .max(1000, 'Summary must be less than 1000 characters')
    .trim(),
  
  // Total Experience
  totalExperience: z.object({
    years: z.number()
      .int('Years must be a whole number')
      .min(0, 'Years cannot be negative')
      .max(50, 'Years cannot exceed 50'),
    months: z.number()
      .int('Months must be a whole number')
      .min(0, 'Months cannot be negative')
      .max(11, 'Months cannot exceed 11'),
  }),
  
  // Skills Summary
  skillsSummary: z.array(z.string())
    .min(1, 'At least one skill summary is required')
    .max(20, 'Maximum 20 skill summaries allowed'),
  
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

// Experience page data schema (wrapper for the content)
export const ExperiencePageDataSchema = z.object({
  experience: ExperienceContentSchema,
});

// Export TypeScript types
export type ExperienceContent = z.infer<typeof ExperienceContentSchema>;
export type ExperiencePageData = z.infer<typeof ExperiencePageDataSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type Technology = z.infer<typeof technologySchema>; 