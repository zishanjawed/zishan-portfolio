import { WritingContentSchema, WritingPageDataSchema, WritingContent, WritingPageData } from '../../schemas/writing';

/**
 * Test data generators for writing schema validation
 */

// Valid writing content examples
export const validWritingContentExamples: WritingContent[] = [
  {
    id: 'test-article-1',
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
    language: 'en',
    metaTitle: 'Test Article Meta Title',
    metaDescription: 'Test article meta description for SEO purposes.',
    trackingId: 'test-article-1'
  },
  {
    id: 'iframe-article',
    title: 'Iframe Article',
    description: 'This is an iframe article that requires a thumbnail image.',
    url: 'https://example.com/iframe-article',
    type: 'iframe',
    publishedDate: '2024-01-10T12:00:00Z',
    readTime: 10,
    tags: ['iframe', 'embed'],
    featured: true,
    thumbnail: 'https://example.com/thumbnail.jpg',
    author: 'Test Author',
    source: 'Test Source',
    platform: 'Personal Blog',
    category: 'frontend',
    language: 'en'
  }
];

// Invalid writing content examples for testing validation
export const invalidWritingContentExamples = [
  {
    // Missing required fields
    id: '',
    title: '',
    description: '',
    url: 'invalid-url',
    type: 'invalid-type',
    publishedDate: 'invalid-date'
  },
  {
    // Invalid ID format
    id: 'INVALID_ID_WITH_UPPERCASE',
    title: 'Valid Title',
    description: 'Valid description that meets minimum length requirements.',
    url: 'https://example.com/valid',
    type: 'external',
    publishedDate: '2024-01-15T10:00:00Z'
  },
  {
    // Description too short
    id: 'valid-id',
    title: 'Valid Title',
    description: 'Too short',
    url: 'https://example.com/valid',
    type: 'external',
    publishedDate: '2024-01-15T10:00:00Z'
  },
  {
    // Invalid URL
    id: 'valid-id',
    title: 'Valid Title',
    description: 'Valid description that meets minimum length requirements.',
    url: 'not-a-valid-url',
    type: 'external',
    publishedDate: '2024-01-15T10:00:00Z'
  },
  {
    // Invalid type
    id: 'valid-id',
    title: 'Valid Title',
    description: 'Valid description that meets minimum length requirements.',
    url: 'https://example.com/valid',
    type: 'invalid-type',
    publishedDate: '2024-01-15T10:00:00Z'
  },
  {
    // Invalid date
    id: 'valid-id',
    title: 'Valid Title',
    description: 'Valid description that meets minimum length requirements.',
    url: 'https://example.com/valid',
    type: 'external',
    publishedDate: 'invalid-date-format'
  },
  {
    // Read time out of range
    id: 'valid-id',
    title: 'Valid Title',
    description: 'Valid description that meets minimum length requirements.',
    url: 'https://example.com/valid',
    type: 'external',
    publishedDate: '2024-01-15T10:00:00Z',
    readTime: 1000 // Too high
  },
  {
    // Too many tags
    id: 'valid-id',
    title: 'Valid Title',
    description: 'Valid description that meets minimum length requirements.',
    url: 'https://example.com/valid',
    type: 'external',
    publishedDate: '2024-01-15T10:00:00Z',
    tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8', 'tag9', 'tag10', 'tag11']
  },
  {
    // Invalid tag format
    id: 'valid-id',
    title: 'Valid Title',
    description: 'Valid description that meets minimum length requirements.',
    url: 'https://example.com/valid',
    type: 'external',
    publishedDate: '2024-01-15T10:00:00Z',
    tags: ['valid-tag', 'invalid@tag']
  },
  {
    // Iframe without thumbnail
    id: 'valid-id',
    title: 'Valid Title',
    description: 'Valid description that meets minimum length requirements.',
    url: 'https://example.com/valid',
    type: 'iframe',
    publishedDate: '2024-01-15T10:00:00Z'
  },
  {
    // Featured without tags
    id: 'valid-id',
    title: 'Valid Title',
    description: 'Valid description that meets minimum length requirements.',
    url: 'https://example.com/valid',
    type: 'external',
    publishedDate: '2024-01-15T10:00:00Z',
    featured: true
  }
];

// Valid page data example
export const validWritingPageData: WritingPageData = {
  title: 'Writing & Articles',
  description: 'Technical articles and blog posts by Zishan Jawed on backend engineering and fintech.',
  metaTitle: 'Writing & Articles - Zishan Jawed',
  metaDescription: 'Explore technical articles and blog posts by Zishan Jawed.',
  socialImage: 'https://example.com/social-image.jpg',
  lastUpdated: '2024-01-15T10:00:00Z',
  trackingEnabled: true,
  writings: validWritingContentExamples,
  totalCount: validWritingContentExamples.length
};

// Invalid page data examples
export const invalidWritingPageDataExamples = [
  {
    // Missing required fields
    title: '',
    description: '',
    writings: [],
    totalCount: 0
  },
  {
    // Description too short
    title: 'Valid Title',
    description: 'Too short',
    writings: validWritingContentExamples,
    totalCount: validWritingContentExamples.length
  },
  {
    // No writings
    title: 'Valid Title',
    description: 'Valid description that meets minimum length requirements.',
    writings: [],
    totalCount: 0
  },
  {
    // Count mismatch
    title: 'Valid Title',
    description: 'Valid description that meets minimum length requirements.',
    writings: validWritingContentExamples,
    totalCount: 999 // Doesn't match actual count
  },
  {
    // Too many writings
    title: 'Valid Title',
    description: 'Valid description that meets minimum length requirements.',
    writings: Array(101).fill(validWritingContentExamples[0]), // More than 100
    totalCount: 101
  }
];

/**
 * Schema validation test utilities
 */

export function testSchemaValidation() {
  console.log('🧪 Testing Writing Content Schema Validation...\n');

  // Test valid examples
  console.log('✅ Testing valid writing content examples:');
  validWritingContentExamples.forEach((example, index) => {
    try {
      WritingContentSchema.parse(example);
      console.log(`  ✓ Example ${index + 1} passed validation`);
    } catch (error) {
      console.log(`  ❌ Example ${index + 1} failed validation:`, error);
    }
  });

  // Test invalid examples
  console.log('\n❌ Testing invalid writing content examples:');
  invalidWritingContentExamples.forEach((example, index) => {
    try {
      WritingContentSchema.parse(example);
      console.log(`  ❌ Example ${index + 1} should have failed but passed`);
    } catch (error) {
      console.log(`  ✓ Example ${index + 1} correctly failed validation`);
    }
  });

  // Test page data validation
  console.log('\n📄 Testing Writing Page Data Schema Validation...\n');

  try {
    WritingPageDataSchema.parse(validWritingPageData);
    console.log('✅ Valid page data passed validation');
  } catch (error) {
    console.log('❌ Valid page data failed validation:', error);
  }

  console.log('\n❌ Testing invalid page data examples:');
  invalidWritingPageDataExamples.forEach((example, index) => {
    try {
      WritingPageDataSchema.parse(example);
      console.log(`  ❌ Example ${index + 1} should have failed but passed`);
    } catch (error) {
      console.log(`  ✓ Example ${index + 1} correctly failed validation`);
    }
  });
}

/**
 * Generate test data for specific scenarios
 */

export function generateTestWritingContent(overrides: Partial<WritingContent> = {}): WritingContent {
  return {
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
    language: 'en',
    ...overrides
  };
}

export function generateTestWritingPageData(overrides: Partial<WritingPageData> = {}): WritingPageData {
  return {
    title: 'Test Writing Page',
    description: 'Test writing page description that meets minimum length requirements.',
    writings: [generateTestWritingContent()],
    totalCount: 1,
    trackingEnabled: true,
    ...overrides
  };
}

/**
 * Validation helper functions
 */

export function validateWritingContent(data: unknown): { success: boolean; data?: WritingContent; error?: string } {
  try {
    const validated = WritingContentSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown validation error' };
  }
}

export function validateWritingPageData(data: unknown): { success: boolean; data?: WritingPageData; error?: string } {
  try {
    const validated = WritingPageDataSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown validation error' };
  }
}

/**
 * Schema statistics and analysis
 */

export function analyzeSchemaCoverage() {
  const requiredFields = ['id', 'title', 'description', 'url', 'type', 'publishedDate'];
  const optionalFields = ['readTime', 'tags', 'featured', 'thumbnail', 'author', 'source', 'platform', 'category', 'language', 'metaTitle', 'metaDescription', 'socialImage', 'trackingId'];
  
  console.log('📊 Writing Content Schema Analysis:');
  console.log(`  Required fields: ${requiredFields.length}`);
  console.log(`  Optional fields: ${optionalFields.length}`);
  console.log(`  Total fields: ${requiredFields.length + optionalFields.length}`);
  console.log(`  Validation rules: ${requiredFields.length + optionalFields.length + 2}`); // +2 for cross-field validations
  
  return {
    requiredFields,
    optionalFields,
    totalFields: requiredFields.length + optionalFields.length,
    validationRules: requiredFields.length + optionalFields.length + 2
  };
} 