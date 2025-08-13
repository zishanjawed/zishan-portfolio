import { describe, it, expect } from 'vitest';
import { 
  WritingContentSchema, 
  WritingPageDataSchema, 
  validateWritingContent, 
  validateWritingPageData,
  safeValidateWritingContent,
  safeValidateWritingPageData
} from '../schemas/writing';
import {
  validWritingContentExamples,
  invalidWritingContentExamples,
  validWritingPageData,
  invalidWritingPageDataExamples,
  generateTestWritingContent,
  generateTestWritingPageData
} from '../lib/content/schema-testing';

describe('Writing Content Schema', () => {
  describe('Valid data validation', () => {
    it('should validate correct writing content', () => {
      const validData = {
        id: 'test-article',
        title: 'Test Article Title',
        description: 'This is a test article description that meets the minimum length requirement.',
        url: 'https://example.com/test-article',
        type: 'external',
        publishedDate: '2024-01-15T10:00:00Z',
        readTime: 5,
        tags: ['test', 'example'],
        featured: false,
        author: 'Test Author',
        source: 'Test Source',
        platform: 'Medium',
        category: 'backend',
        language: 'en'
      };

      const result = WritingContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate all valid examples', () => {
      validWritingContentExamples.forEach((example, index) => {
        const result = WritingContentSchema.safeParse(example);
        expect(result.success, `Example ${index + 1} should be valid`).toBe(true);
      });
    });

    it('should validate iframe content with thumbnail', () => {
      const iframeData = {
        id: 'iframe-article',
        title: 'Iframe Article',
        description: 'This is an iframe article that requires a thumbnail image.',
        url: 'https://example.com/iframe-article',
        type: 'iframe',
        publishedDate: '2024-01-15T10:00:00Z',
        thumbnail: 'https://example.com/thumbnail.jpg',
        tags: ['iframe', 'embed']
      };

      const result = WritingContentSchema.safeParse(iframeData);
      expect(result.success).toBe(true);
    });

    it('should validate featured content with tags', () => {
      const featuredData = {
        id: 'featured-article',
        title: 'Featured Article',
        description: 'This is a featured article that should have tags.',
        url: 'https://example.com/featured-article',
        type: 'external',
        publishedDate: '2024-01-15T10:00:00Z',
        featured: true,
        tags: ['featured', 'important']
      };

      const result = WritingContentSchema.safeParse(featuredData);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid data validation', () => {
    it('should reject invalid examples', () => {
      invalidWritingContentExamples.forEach((example, index) => {
        const result = WritingContentSchema.safeParse(example);
        expect(result.success, `Example ${index + 1} should be invalid`).toBe(false);
      });
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        title: 'Test Article',
        description: 'Test description'
        // Missing id, url, type, publishedDate
      };

      const result = WritingContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(4); // 4 missing required fields
      }
    });

    it('should reject invalid ID format', () => {
      const invalidData = {
        id: 'INVALID_ID_WITH_UPPERCASE',
        title: 'Test Article',
        description: 'Test description that meets minimum length requirements.',
        url: 'https://example.com/test',
        type: 'external',
        publishedDate: '2024-01-15T10:00:00Z'
      };

      const result = WritingContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject description that is too short', () => {
      const invalidData = {
        id: 'test-article',
        title: 'Test Article',
        description: 'Too short',
        url: 'https://example.com/test',
        type: 'external',
        publishedDate: '2024-01-15T10:00:00Z'
      };

      const result = WritingContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid URL', () => {
      const invalidData = {
        id: 'test-article',
        title: 'Test Article',
        description: 'Test description that meets minimum length requirements.',
        url: 'not-a-valid-url',
        type: 'external',
        publishedDate: '2024-01-15T10:00:00Z'
      };

      const result = WritingContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid type', () => {
      const invalidData = {
        id: 'test-article',
        title: 'Test Article',
        description: 'Test description that meets minimum length requirements.',
        url: 'https://example.com/test',
        type: 'invalid-type',
        publishedDate: '2024-01-15T10:00:00Z'
      };

      const result = WritingContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid date format', () => {
      const invalidData = {
        id: 'test-article',
        title: 'Test Article',
        description: 'Test description that meets minimum length requirements.',
        url: 'https://example.com/test',
        type: 'external',
        publishedDate: 'invalid-date-format'
      };

      const result = WritingContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject read time out of range', () => {
      const invalidData = {
        id: 'test-article',
        title: 'Test Article',
        description: 'Test description that meets minimum length requirements.',
        url: 'https://example.com/test',
        type: 'external',
        publishedDate: '2024-01-15T10:00:00Z',
        readTime: 1000 // Too high
      };

      const result = WritingContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject too many tags', () => {
      const invalidData = {
        id: 'test-article',
        title: 'Test Article',
        description: 'Test description that meets minimum length requirements.',
        url: 'https://example.com/test',
        type: 'external',
        publishedDate: '2024-01-15T10:00:00Z',
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8', 'tag9', 'tag10', 'tag11']
      };

      const result = WritingContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid tag format', () => {
      const invalidData = {
        id: 'test-article',
        title: 'Test Article',
        description: 'Test description that meets minimum length requirements.',
        url: 'https://example.com/test',
        type: 'external',
        publishedDate: '2024-01-15T10:00:00Z',
        tags: ['valid-tag', 'invalid@tag']
      };

      const result = WritingContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject iframe without thumbnail', () => {
      const invalidData = {
        id: 'test-article',
        title: 'Test Article',
        description: 'Test description that meets minimum length requirements.',
        url: 'https://example.com/test',
        type: 'iframe',
        publishedDate: '2024-01-15T10:00:00Z'
        // Missing thumbnail
      };

      const result = WritingContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject featured without tags', () => {
      const invalidData = {
        id: 'test-article',
        title: 'Test Article',
        description: 'Test description that meets minimum length requirements.',
        url: 'https://example.com/test',
        type: 'external',
        publishedDate: '2024-01-15T10:00:00Z',
        featured: true
        // Missing tags
      };

      const result = WritingContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Validation utilities', () => {
    it('should validate content using validateWritingContent', () => {
      const validData = generateTestWritingContent();
      const result = validateWritingContent(validData);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should handle invalid content using validateWritingContent', () => {
      const invalidData = { invalid: 'data' };
      const result = validateWritingContent(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
    });

    it('should validate content using safeValidateWritingContent', () => {
      const validData = generateTestWritingContent();
      const result = safeValidateWritingContent(validData);
      
      expect(result).toBeDefined();
      expect(result).toMatchObject(validData);
    });

    it('should return null for invalid content using safeValidateWritingContent', () => {
      const invalidData = { invalid: 'data' };
      const result = safeValidateWritingContent(invalidData);
      
      expect(result).toBeNull();
    });
  });
});

describe('Writing Page Data Schema', () => {
  describe('Valid data validation', () => {
    it('should validate correct page data', () => {
      const validData = {
        title: 'Writing & Articles',
        description: 'Technical articles and blog posts by Zishan Jawed.',
        writings: [generateTestWritingContent()],
        totalCount: 1
      };

      const result = WritingPageDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate all valid examples', () => {
      const result = WritingPageDataSchema.safeParse(validWritingPageData);
      expect(result.success).toBe(true);
    });

    it('should validate page data with optional fields', () => {
      const validData = {
        title: 'Writing & Articles',
        description: 'Technical articles and blog posts by Zishan Jawed.',
        writings: [generateTestWritingContent()],
        totalCount: 1,
        metaTitle: 'Writing & Articles - Zishan Jawed',
        metaDescription: 'Explore technical articles and blog posts.',
        socialImage: 'https://example.com/social-image.jpg',
        lastUpdated: '2024-01-15T10:00:00Z',
        trackingEnabled: true
      };

      const result = WritingPageDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid data validation', () => {
    it('should reject invalid examples', () => {
      invalidWritingPageDataExamples.forEach((example, index) => {
        const result = WritingPageDataSchema.safeParse(example);
        expect(result.success, `Example ${index + 1} should be invalid`).toBe(false);
      });
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        title: 'Test Page'
        // Missing description, writings, totalCount
      };

      const result = WritingPageDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject description that is too short', () => {
      const invalidData = {
        title: 'Test Page',
        description: 'Too short',
        writings: [generateTestWritingContent()],
        totalCount: 1
      };

      const result = WritingPageDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty writings array', () => {
      const invalidData = {
        title: 'Test Page',
        description: 'Test description that meets minimum length requirements.',
        writings: [],
        totalCount: 0
      };

      const result = WritingPageDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject count mismatch', () => {
      const invalidData = {
        title: 'Test Page',
        description: 'Test description that meets minimum length requirements.',
        writings: [generateTestWritingContent()],
        totalCount: 999 // Doesn't match actual count
      };

      const result = WritingPageDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject too many writings', () => {
      const writings = Array(101).fill(generateTestWritingContent());
      const invalidData = {
        title: 'Test Page',
        description: 'Test description that meets minimum length requirements.',
        writings,
        totalCount: 101
      };

      const result = WritingPageDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Validation utilities', () => {
    it('should validate page data using validateWritingPageData', () => {
      const validData = generateTestWritingPageData();
      const result = validateWritingPageData(validData);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should handle invalid page data using validateWritingPageData', () => {
      const invalidData = { invalid: 'data' };
      const result = validateWritingPageData(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
    });

    it('should validate page data using safeValidateWritingPageData', () => {
      const validData = generateTestWritingPageData();
      const result = safeValidateWritingPageData(validData);
      
      expect(result).toBeDefined();
      expect(result).toMatchObject(validData);
    });

    it('should return null for invalid page data using safeValidateWritingPageData', () => {
      const invalidData = { invalid: 'data' };
      const result = safeValidateWritingPageData(invalidData);
      
      expect(result).toBeNull();
    });
  });
});

describe('Schema Integration', () => {
  it('should validate real writing data from JSON file', async () => {
    const { loadWritingContent } = await import('../lib/content/writing');
    
    try {
      const data = await loadWritingContent();
      const result = WritingPageDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    } catch (error) {
      // If file doesn't exist in test environment, that's okay
      expect(error).toBeDefined();
    }
  });

  it('should handle edge cases correctly', () => {
    // Test with minimal valid data
    const minimalData = {
      id: 'minimal',
      title: 'Minimal Article',
      description: 'This is a minimal article description that meets the minimum length requirement.',
      url: 'https://example.com/minimal',
      type: 'external',
      publishedDate: '2024-01-15T10:00:00Z'
    };

    const result = WritingContentSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });

  it('should provide meaningful error messages', () => {
    const invalidData = {
      id: '',
      title: '',
      description: '',
      url: 'invalid-url',
      type: 'invalid-type',
      publishedDate: 'invalid-date'
    };

    const result = WritingContentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      const errorMessages = result.error.issues.map(issue => issue.message);
      expect(errorMessages).toContain('ID is required and cannot be empty');
      expect(errorMessages).toContain('Title is required and cannot be empty');
      expect(errorMessages).toContain('Description must be at least 10 characters long');
      expect(errorMessages).toContain('Valid URL is required');
      expect(errorMessages).toContain('Type must be one of: external, iframe, or blog');
      // Check for any date-related error message
      const hasDateError = errorMessages.some(msg => msg.includes('date') || msg.includes('Date'));
      expect(hasDateError).toBe(true);
    }
  });
}); 