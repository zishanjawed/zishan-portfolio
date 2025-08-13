import { describe, it, expect } from 'vitest';
import { PersonContentSchema, PersonPageDataSchema } from '../schemas/person';

describe('Person Schema Validation', () => {
  const validPersonData = {
    name: 'Zishan Jawed',
    title: 'Backend Engineer & Fintech Specialist',
    email: 'zishan@zishanjawed.com',
    phone: '+91-9876543210',
    summary: 'Experienced backend engineer specializing in fintech, payment systems, and scalable architecture.',
    bio: 'I\'m a passionate backend engineer with over 8 years of experience building scalable systems for fintech and ecommerce applications.',
    location: {
      city: 'Mumbai',
      country: 'India',
      timezone: 'Asia/Kolkata'
    },
    social: [
      {
        platform: 'github',
        url: 'https://github.com/zishanjawed',
        username: 'zishanjawed',
        displayName: 'Zishan Jawed',
        verified: true
      }
    ],
    skills: [
      {
        name: 'Node.js',
        category: 'programming',
        proficiency: 'expert',
        yearsOfExperience: 8,
        description: 'Server-side JavaScript runtime',
        featured: true,
        order: 1,
        tags: ['javascript', 'backend']
      }
    ],
    availability: {
      status: 'available',
      message: 'Available for new projects',
      responseTime: 'Within 24 hours'
    },
    experience: {
      years: 8,
      focus: ['Backend Engineering', 'Fintech Solutions']
    },
    avatar: 'https://example.com/avatar.jpg',
    banner: 'https://example.com/banner.jpg',
    metaTitle: 'Zishan Jawed - Backend Engineer',
    metaDescription: 'Experienced backend engineer specializing in fintech and scalable architecture.',
    socialImage: 'https://example.com/social.jpg',
    trackingEnabled: true,
    lastUpdated: '2024-12-15T10:00:00Z'
  };

  describe('PersonContentSchema', () => {
    it('should validate valid person data', () => {
      const result = PersonContentSchema.safeParse(validPersonData);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const invalidData = { ...validPersonData };
      delete invalidData.name;
      
      const result = PersonContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('name'))).toBe(true);
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = { ...validPersonData, email: 'invalid-email' };
      
      const result = PersonContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true);
      }
    });

    it('should reject invalid social platform', () => {
      const invalidData = {
        ...validPersonData,
        social: [{ ...validPersonData.social[0], platform: 'invalid-platform' }]
      };
      
      const result = PersonContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('social') && issue.path.includes('platform'))).toBe(true);
      }
    });

    it('should reject invalid skill proficiency', () => {
      const invalidData = {
        ...validPersonData,
        skills: [{ ...validPersonData.skills[0], proficiency: 'invalid-level' }]
      };
      
      const result = PersonContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('skills') && issue.path.includes('proficiency'))).toBe(true);
      }
    });

    it('should reject invalid availability status', () => {
      const invalidData = {
        ...validPersonData,
        availability: { ...validPersonData.availability, status: 'invalid-status' }
      };
      
      const result = PersonContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('availability') && issue.path.includes('status'))).toBe(true);
      }
    });

    it('should reject invalid URL format', () => {
      const invalidData = {
        ...validPersonData,
        social: [{ ...validPersonData.social[0], url: 'invalid-url' }]
      };
      
      const result = PersonContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('social') && issue.path.includes('url'))).toBe(true);
      }
    });

    it('should reject invalid datetime format', () => {
      const invalidData = { ...validPersonData, lastUpdated: 'invalid-date' };
      
      const result = PersonContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('lastUpdated'))).toBe(true);
      }
    });

    it('should accept optional fields', () => {
      const dataWithoutOptionals = {
        ...validPersonData,
        phone: undefined,
        bio: undefined,
        availability: undefined,
        avatar: undefined,
        banner: undefined,
        socialImage: undefined
      };
      
      const result = PersonContentSchema.safeParse(dataWithoutOptionals);
      expect(result.success).toBe(true);
    });

    it('should validate skill requirements', () => {
      const invalidData = { ...validPersonData, skills: [] };
      
      const result = PersonContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('skills'))).toBe(true);
      }
    });

    it('should validate social links requirements', () => {
      const invalidData = { ...validPersonData, social: [] };
      
      const result = PersonContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('social'))).toBe(true);
      }
    });
  });

  describe('PersonPageDataSchema', () => {
    it('should validate valid page data', () => {
      const validPageData = {
        person: validPersonData
      };
      
      const result = PersonPageDataSchema.safeParse(validPageData);
      expect(result.success).toBe(true);
    });

    it('should reject missing person field', () => {
      const invalidData = {};
      
      const result = PersonPageDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('person'))).toBe(true);
      }
    });

    it('should reject invalid person data', () => {
      const invalidData = {
        person: { name: 'Invalid' } // Missing required fields
      };
      
      const result = PersonPageDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings appropriately', () => {
      const invalidData = { ...validPersonData, name: '' };
      
      const result = PersonContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should handle very long strings', () => {
      const invalidData = { 
        ...validPersonData, 
        summary: 'a'.repeat(1001) // Exceeds 1000 character limit
      };
      
      const result = PersonContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should handle negative years of experience', () => {
      const invalidData = {
        ...validPersonData,
        skills: [{ ...validPersonData.skills[0], yearsOfExperience: -1 }]
      };
      
      const result = PersonContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should handle excessive years of experience', () => {
      const invalidData = {
        ...validPersonData,
        skills: [{ ...validPersonData.skills[0], yearsOfExperience: 51 }]
      };
      
      const result = PersonContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
}); 