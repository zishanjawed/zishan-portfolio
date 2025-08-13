import { describe, it, expect } from 'vitest';
import { filterWritings, getUniquePlatforms, getUniqueCategories, createDefaultFilters, hasActiveFilters } from '../lib/filtering';
import { WritingContent } from '../types/writing';

// Mock writing data for testing
const mockWritings: WritingContent[] = [
  {
    id: 'test-1',
    title: 'Building Scalable Payment Systems',
    description: 'A comprehensive guide to payment architecture',
    url: 'https://example.com/payment-systems',
    type: 'external',
    publishedDate: '2024-12-15T10:00:00Z',
    readTime: 12,
    tags: ['fintech', 'payments', 'architecture'],
    featured: true,
    author: 'Zishan Jawed',
    source: 'Medium'
  },
  {
    id: 'test-2',
    title: 'Microservices Patterns',
    description: 'Exploring microservices patterns and anti-patterns',
    url: 'https://example.com/microservices',
    type: 'external',
    publishedDate: '2024-11-20T14:30:00Z',
    readTime: 8,
    tags: ['microservices', 'backend', 'patterns'],
    featured: false,
    author: 'Zishan Jawed',
    source: 'Dev.to'
  },
  {
    id: 'test-3',
    title: 'AWS Cost Optimization',
    description: 'Practical strategies for reducing AWS costs',
    url: 'https://example.com/aws-costs',
    type: 'blog',
    publishedDate: '2024-10-10T09:15:00Z',
    readTime: 15,
    tags: ['aws', 'cost-optimization', 'cloud'],
    featured: true,
    author: 'Zishan Jawed',
    source: 'Tech Blog'
  }
];

describe('Filtering Functions', () => {
  describe('filterWritings', () => {
    it('should return all writings when no filters are applied', () => {
      const filters = createDefaultFilters();
      const result = filterWritings(mockWritings, filters);
      expect(result).toHaveLength(3);
    });

    it('should filter by platform', () => {
      const filters = createDefaultFilters();
      filters.platform = 'Medium';
      const result = filterWritings(mockWritings, filters);
      expect(result).toHaveLength(1);
      expect(result[0].source).toBe('Medium');
    });

    it('should filter by category', () => {
      const filters = createDefaultFilters();
      filters.category = 'fintech';
      const result = filterWritings(mockWritings, filters);
      expect(result).toHaveLength(1);
      expect(result[0].tags).toContain('fintech');
    });

    it('should filter by search query', () => {
      const filters = createDefaultFilters();
      filters.search = 'payment';
      const result = filterWritings(mockWritings, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toContain('Payment');
    });

    it('should filter by featured status', () => {
      const filters = createDefaultFilters();
      filters.featured = true;
      const result = filterWritings(mockWritings, filters);
      expect(result).toHaveLength(2);
      expect(result.every(w => w.featured)).toBe(true);
    });

    it('should combine multiple filters', () => {
      const filters = createDefaultFilters();
      filters.platform = 'Medium';
      filters.featured = true;
      const result = filterWritings(mockWritings, filters);
      expect(result).toHaveLength(1);
      expect(result[0].source).toBe('Medium');
      expect(result[0].featured).toBe(true);
    });

    it('should handle case-insensitive search', () => {
      const filters = createDefaultFilters();
      filters.search = 'PAYMENT';
      const result = filterWritings(mockWritings, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toContain('Payment');
    });

    it('should handle fuzzy search', () => {
      const filters = createDefaultFilters();
      filters.search = 'pay';
      const result = filterWritings(mockWritings, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toContain('Payment');
    });

    it('should return empty array when no matches found', () => {
      const filters = createDefaultFilters();
      filters.search = 'nonexistent';
      const result = filterWritings(mockWritings, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe('getUniquePlatforms', () => {
    it('should return unique platforms sorted alphabetically', () => {
      const result = getUniquePlatforms(mockWritings);
      expect(result).toEqual(['Dev.to', 'Medium', 'Tech Blog']);
    });

    it('should handle writings without source', () => {
      const writingsWithoutSource = [
        { ...mockWritings[0], source: undefined },
        { ...mockWritings[1], source: 'Medium' }
      ];
      const result = getUniquePlatforms(writingsWithoutSource);
      expect(result).toEqual(['Medium']);
    });

    it('should return empty array for empty writings', () => {
      const result = getUniquePlatforms([]);
      expect(result).toEqual([]);
    });
  });

  describe('getUniqueCategories', () => {
    it('should return unique categories sorted alphabetically', () => {
      const result = getUniqueCategories(mockWritings);
      expect(result).toContain('architecture');
      expect(result).toContain('aws');
      expect(result).toContain('backend');
      expect(result).toContain('cloud');
      expect(result).toContain('cost-optimization');
      expect(result).toContain('fintech');
      expect(result).toContain('microservices');
      expect(result).toContain('patterns');
      expect(result).toContain('payments');
    });

    it('should handle writings without tags', () => {
      const writingsWithoutTags = [
        { ...mockWritings[0], tags: undefined },
        { ...mockWritings[1], tags: ['test'] }
      ];
      const result = getUniqueCategories(writingsWithoutTags);
      expect(result).toEqual(['test']);
    });

    it('should return empty array for empty writings', () => {
      const result = getUniqueCategories([]);
      expect(result).toEqual([]);
    });
  });

  describe('createDefaultFilters', () => {
    it('should return default filter state', () => {
      const result = createDefaultFilters();
      expect(result).toEqual({
        platform: '',
        category: '',
        search: '',
        featured: false
      });
    });
  });

  describe('hasActiveFilters', () => {
    it('should return false for default filters', () => {
      const filters = createDefaultFilters();
      expect(hasActiveFilters(filters)).toBe(false);
    });

    it('should return true when platform filter is active', () => {
      const filters = createDefaultFilters();
      filters.platform = 'Medium';
      expect(hasActiveFilters(filters)).toBe(true);
    });

    it('should return true when category filter is active', () => {
      const filters = createDefaultFilters();
      filters.category = 'fintech';
      expect(hasActiveFilters(filters)).toBe(true);
    });

    it('should return true when search filter is active', () => {
      const filters = createDefaultFilters();
      filters.search = 'test';
      expect(hasActiveFilters(filters)).toBe(true);
    });

    it('should return true when featured filter is active', () => {
      const filters = createDefaultFilters();
      filters.featured = true;
      expect(hasActiveFilters(filters)).toBe(true);
    });
  });
}); 