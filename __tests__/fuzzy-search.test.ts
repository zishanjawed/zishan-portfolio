import { describe, it, expect, beforeEach, vi } from 'vitest';
import { performFuzzySearch, getSearchSuggestions, clearSearchCache } from '@/lib/search/fuzzy-search';

// Mock the content loaders
vi.mock('@/lib/content/projects', () => ({
  loadProjectsContent: vi.fn().mockResolvedValue({
    projects: [
      {
        id: 'test-project',
        title: 'Test Payment Platform',
        description: 'A scalable payment processing platform for fintech applications',
        category: 'fintech',
        client: 'Test Client',
        technologies: [
          { name: 'Node.js', category: 'backend' },
          { name: 'PostgreSQL', category: 'database' }
        ],
        caseStudy: {
          lessons: ['Microservices architecture', 'High availability']
        }
      }
    ]
  })
}));

vi.mock('@/lib/content/writing', () => ({
  loadWritingContent: vi.fn().mockResolvedValue({
    writings: [
      {
        id: 'test-article',
        title: 'Building Scalable Payment Systems',
        description: 'A comprehensive guide to designing payment architectures',
        category: 'fintech',
        tags: ['payments', 'architecture', 'scalability'],
        url: 'https://example.com/article'
      }
    ]
  })
}));

vi.mock('@/lib/content/experience', () => ({
  loadExperienceContent: vi.fn().mockResolvedValue({
    experience: [
      {
        id: 'test-experience',
        title: 'Senior Backend Engineer',
        description: 'Led development of high-performance backend systems',
        category: 'backend',
        skills: ['Node.js', 'Python', 'PostgreSQL'],
        technologies: [
          { name: 'Node.js', category: 'backend' },
          { name: 'Python', category: 'backend' }
        ]
      }
    ]
  })
}));

vi.mock('@/lib/content/skills', () => ({
  loadSkillsContent: vi.fn().mockResolvedValue({
    skills: [
      {
        id: 'test-skill',
        name: 'Node.js',
        description: 'JavaScript runtime for server-side development',
        category: 'backend',
        tags: ['javascript', 'server-side'],
        technologies: [
          { name: 'Node.js', category: 'backend' }
        ]
      }
    ]
  })
}));

vi.mock('@/lib/content/person', () => ({
  loadPersonContent: vi.fn().mockResolvedValue({
    name: 'Zishan Jawed',
    bio: 'Backend engineer specializing in fintech and payment systems',
    skills: ['Node.js', 'Python', 'PostgreSQL'],
    lastUpdated: '2024-12-15T10:00:00Z'
  })
}));

describe('Fuzzy Search', () => {
  beforeEach(() => {
    clearSearchCache();
  });

  describe('performFuzzySearch', () => {
    it('should return empty array for empty query', async () => {
      const results = await performFuzzySearch('');
      expect(results).toEqual([]);
    });

    it('should return empty array for whitespace-only query', async () => {
      const results = await performFuzzySearch('   ');
      expect(results).toEqual([]);
    });

    it('should find projects by title', async () => {
      const results = await performFuzzySearch('payment');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].type).toBe('project');
      expect(results[0].title).toContain('Payment');
    });

    it('should find articles by title', async () => {
      const results = await performFuzzySearch('scalable');
      expect(results.length).toBeGreaterThan(0);
      const article = results.find(r => r.type === 'writing');
      expect(article).toBeDefined();
      expect(article?.title).toContain('Scalable');
    });

    it('should find content by technology', async () => {
      const results = await performFuzzySearch('node.js');
      expect(results.length).toBeGreaterThan(0);
      const hasNodeJs = results.some(r => 
        r.technologies?.some(t => t.name.toLowerCase().includes('node.js'))
      );
      expect(hasNodeJs).toBe(true);
    });

    it('should find content by tags', async () => {
      const results = await performFuzzySearch('microservices');
      expect(results.length).toBeGreaterThan(0);
      const hasMicroservices = results.some(r => 
        r.tags?.some(tag => tag.toLowerCase().includes('microservices'))
      );
      expect(hasMicroservices).toBe(true);
    });

    it('should respect limit option', async () => {
      const results = await performFuzzySearch('test', { limit: 1 });
      expect(results.length).toBeLessThanOrEqual(1);
    });

    it('should filter by type', async () => {
      const results = await performFuzzySearch('test', { type: 'project' });
      expect(results.every(r => r.type === 'project')).toBe(true);
    });

    it('should filter by category', async () => {
      const results = await performFuzzySearch('test', { category: 'fintech' });
      expect(results.every(r => r.category === 'fintech')).toBe(true);
    });

    it('should include relevance scores', async () => {
      const results = await performFuzzySearch('payment');
      expect(results[0].relevance).toBeGreaterThan(0);
      expect(results[0].relevance).toBeLessThanOrEqual(1);
    });

    it('should include highlights', async () => {
      const results = await performFuzzySearch('payment');
      expect(results[0].highlights).toBeDefined();
    });
  });

  describe('getSearchSuggestions', () => {
    it('should return empty array for empty query', async () => {
      const suggestions = await getSearchSuggestions('');
      expect(suggestions).toEqual([]);
    });

    it('should return empty array for short query', async () => {
      const suggestions = await getSearchSuggestions('a');
      expect(suggestions).toEqual([]);
    });

    it('should return suggestions for valid query', async () => {
      const suggestions = await getSearchSuggestions('pay');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.toLowerCase().includes('pay'))).toBe(true);
    });

    it('should limit suggestions to 10', async () => {
      const suggestions = await getSearchSuggestions('test');
      expect(suggestions.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Search result structure', () => {
    it('should have correct result structure', async () => {
      const results = await performFuzzySearch('test');
      if (results.length > 0) {
        const result = results[0];
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('description');
        expect(result).toHaveProperty('type');
        expect(result).toHaveProperty('relevance');
        expect(result).toHaveProperty('highlights');
        expect(['project', 'writing', 'experience', 'skill', 'person']).toContain(result.type);
      }
    });

    it('should include metadata for projects', async () => {
      const results = await performFuzzySearch('test', { type: 'project' });
      if (results.length > 0) {
        const result = results[0];
        expect(result.metadata).toBeDefined();
        expect(result.metadata?.client).toBeDefined();
      }
    });

    it('should include metadata for writing', async () => {
      const results = await performFuzzySearch('test', { type: 'writing' });
      if (results.length > 0) {
        const result = results[0];
        expect(result.metadata).toBeDefined();
        expect(result.metadata?.publishedDate).toBeDefined();
      }
    });
  });
}); 