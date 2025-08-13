import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import {
  loadPersonContent,
  loadExperienceContent,
  loadSkillsContent,
  loadProjectsContent,
  loadWritingContent,
  loadAllContent,
  validateContent,
  clearContentCache,
  getCacheStats,
  contentFileExists,
  getContentFilePath,
  getContentFileModTime
} from '../lib/content/loaders';
import { PersonPageDataSchema } from '../schemas/person';
import { ExperiencePageDataSchema } from '../schemas/experience';
import { SkillsPageDataSchema } from '../schemas/skills';
import { ProjectsPageDataSchema } from '../schemas/projects';
import { WritingPageDataSchema } from '../schemas/writing';

// Mock fs module with proper structure
vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn(),
    access: vi.fn(),
    stat: vi.fn(),
  },
}));

// Mock path module
vi.mock('path', () => ({
  join: vi.fn(),
}));

describe('Content Loaders', () => {
  const mockFs = vi.mocked(fs);
  const mockPath = vi.mocked(path);

  const mockPersonData = {
    person: {
      name: 'Zishan Jawed',
      title: 'Backend Engineer',
      email: 'zishan@example.com',
      summary: 'Experienced backend engineer',
      location: {
        city: 'Mumbai',
        country: 'India'
      },
      social: [{
        platform: 'github',
        url: 'https://github.com/zishanjawed',
        username: 'zishanjawed',
        displayName: 'Zishan Jawed',
        verified: true
      }],
      skills: [{
        name: 'Node.js',
        category: 'programming',
        proficiency: 'expert',
        yearsOfExperience: 8,
        featured: true,
        order: 1
      }],
      experience: {
        years: 8,
        focus: ['Backend Engineering']
      },
      metaTitle: 'Zishan Jawed - Backend Engineer',
      metaDescription: 'Experienced backend engineer',
      trackingEnabled: true,
      lastUpdated: '2024-12-15T10:00:00Z'
    }
  };

  const mockExperienceData = {
    experience: {
      workExperience: [{
        id: 'test-job',
        company: 'Test Company',
        position: 'Backend Engineer',
        location: 'Mumbai',
        startDate: '2023-01-01T00:00:00Z',
        description: 'Test job description',
        responsibilities: ['Test responsibility'],
        technologies: [{
          name: 'Node.js',
          category: 'backend'
        }],
        industry: 'Tech',
        projectType: 'full-time',
        featured: true
      }],
      education: [{
        id: 'test-education',
        institution: 'Test University',
        degree: 'Bachelor of Engineering',
        field: 'Computer Science',
        startDate: '2016-08-01T00:00:00Z',
        location: 'Mumbai',
        featured: true
      }],
      summary: 'Test experience summary',
      totalExperience: {
        years: 8,
        months: 0
      },
      skillsSummary: ['Backend Engineering'],
      metaTitle: 'Experience - Zishan Jawed',
      metaDescription: 'Test experience description',
      trackingEnabled: true,
      lastUpdated: '2024-12-15T10:00:00Z'
    }
  };

  const mockSkillsData = {
    skills: {
      title: 'Technical Skills',
      description: 'Technical skills description',
      categories: [{
        id: 'programming',
        name: 'Programming Languages',
        description: 'Programming languages category',
        order: 1
      }],
      skills: [{
        id: 'nodejs',
        name: 'Node.js',
        category: 'programming',
        proficiency: 'expert',
        yearsOfExperience: 8,
        featured: true,
        order: 1
      }],
      levels: [{
        level: 'expert',
        description: 'Expert level',
        yearsRange: { min: 8, max: 50 },
        color: '#7c3aed'
      }],
      summary: {
        totalSkills: 1,
        categories: 1,
        yearsOfExperience: 8,
        expertSkills: 1,
        advancedSkills: 0,
        intermediateSkills: 0,
        beginnerSkills: 0
      },
      metaTitle: 'Skills - Zishan Jawed',
      metaDescription: 'Technical skills description',
      trackingEnabled: true,
      lastUpdated: '2024-12-15T10:00:00Z'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    clearContentCache();
    
    // Setup default mocks
    mockPath.join.mockReturnValue('/mock/path/data.json');
    mockFs.readFile.mockResolvedValue('{}');
    mockFs.access.mockResolvedValue(undefined);
    mockFs.stat.mockResolvedValue({
      mtime: new Date('2024-12-15T10:00:00Z')
    } as any);
  });

  afterEach(() => {
    clearContentCache();
  });

  describe('loadPersonContent', () => {
    it('should load and validate person content successfully', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockPersonData));

      const result = await loadPersonContent();

      expect(result).toEqual(mockPersonData);
      expect(mockPath.join).toHaveBeenCalledWith(process.cwd(), 'data', 'person.json');
      expect(mockFs.readFile).toHaveBeenCalledWith('/mock/path/data.json', 'utf-8');
    });

    it('should throw error for invalid person data', async () => {
      const invalidData = { person: { name: 'Invalid' } }; // Missing required fields
      mockFs.readFile.mockResolvedValue(JSON.stringify(invalidData));

      await expect(loadPersonContent()).rejects.toThrow('Failed to load content from /mock/path/data.json');
    });

    it('should throw error for file read failure', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      await expect(loadPersonContent()).rejects.toThrow('Failed to load content from /mock/path/data.json: File not found');
    });

    it('should throw error for invalid JSON', async () => {
      mockFs.readFile.mockResolvedValue('invalid json');

      await expect(loadPersonContent()).rejects.toThrow('Failed to load content from /mock/path/data.json');
    });
  });

  describe('loadExperienceContent', () => {
    it('should load and validate experience content successfully', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockExperienceData));

      const result = await loadExperienceContent();

      expect(result).toEqual(mockExperienceData);
      expect(mockPath.join).toHaveBeenCalledWith(process.cwd(), 'data', 'experience.json');
    });

    it('should throw error for invalid experience data', async () => {
      const invalidData = { experience: { workExperience: [] } }; // Missing required fields
      mockFs.readFile.mockResolvedValue(JSON.stringify(invalidData));

      await expect(loadExperienceContent()).rejects.toThrow('Failed to load content from /mock/path/data.json');
    });
  });

  describe('loadSkillsContent', () => {
    it('should load and validate skills content successfully', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockSkillsData));

      const result = await loadSkillsContent();

      expect(result).toEqual(mockSkillsData);
      expect(mockPath.join).toHaveBeenCalledWith(process.cwd(), 'data', 'skills.json');
    });

    it('should throw error for invalid skills data', async () => {
      const invalidData = { skills: { skills: [] } }; // Missing required fields
      mockFs.readFile.mockResolvedValue(JSON.stringify(invalidData));

      await expect(loadSkillsContent()).rejects.toThrow('Failed to load content from /mock/path/data.json');
    });
  });

  describe('loadProjectsContent', () => {
    it('should load and validate projects content successfully', async () => {
      const mockProjectsData = {
        title: 'Projects',
        description: 'Projects description',
        projects: [{
          id: 'test-project',
          title: 'Test Project',
          description: 'Test project description',
          shortDescription: 'Test short description',
          category: 'web-app',
          client: 'Test Client',
          technologies: [{
            name: 'Node.js',
            category: 'backend'
          }],
          startDate: '2023-01-01T00:00:00Z',
          status: 'completed',
          featured: true
        }],
        metaTitle: 'Projects - Zishan Jawed',
        metaDescription: 'Projects description',
        trackingEnabled: true,
        lastUpdated: '2024-12-15T10:00:00Z'
      };

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockProjectsData));

      const result = await loadProjectsContent();

      expect(result).toEqual(mockProjectsData);
      expect(mockPath.join).toHaveBeenCalledWith(process.cwd(), 'data', 'projects.json');
    });
  });

  describe('loadWritingContent', () => {
    it('should load and validate writing content successfully', async () => {
      const mockWritingData = {
        title: 'Writing',
        description: 'Writing description',
        writings: [{
          id: 'test-article',
          title: 'Test Article',
          description: 'Test article description',
          url: 'https://example.com/article',
          type: 'external',
          publishedDate: '2024-12-15T10:00:00Z',
          author: 'Zishan Jawed',
          featured: true
        }],
        metaTitle: 'Writing - Zishan Jawed',
        metaDescription: 'Writing description',
        trackingEnabled: true,
        lastUpdated: '2024-12-15T10:00:00Z'
      };

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockWritingData));

      const result = await loadWritingContent();

      expect(result).toEqual(mockWritingData);
      expect(mockPath.join).toHaveBeenCalledWith(process.cwd(), 'data', 'writing.json');
    });
  });

  describe('loadAllContent', () => {
    it('should load all content types successfully', async () => {
      const mockProjectsData = {
        title: 'Projects',
        description: 'Projects description',
        projects: [{
          id: 'test-project',
          title: 'Test Project',
          description: 'Test project description',
          shortDescription: 'Test short description',
          category: 'web-app',
          client: 'Test Client',
          technologies: [{
            name: 'Node.js',
            category: 'backend'
          }],
          startDate: '2023-01-01T00:00:00Z',
          status: 'completed',
          featured: true
        }],
        metaTitle: 'Projects - Zishan Jawed',
        metaDescription: 'Projects description',
        trackingEnabled: true,
        lastUpdated: '2024-12-15T10:00:00Z'
      };

      const mockWritingData = {
        title: 'Writing',
        description: 'Writing description',
        writings: [{
          id: 'test-article',
          title: 'Test Article',
          description: 'Test article description',
          url: 'https://example.com/article',
          type: 'external',
          publishedDate: '2024-12-15T10:00:00Z',
          author: 'Zishan Jawed',
          featured: true
        }],
        metaTitle: 'Writing - Zishan Jawed',
        metaDescription: 'Writing description',
        trackingEnabled: true,
        lastUpdated: '2024-12-15T10:00:00Z'
      };

      mockFs.readFile
        .mockResolvedValueOnce(JSON.stringify(mockPersonData))
        .mockResolvedValueOnce(JSON.stringify(mockExperienceData))
        .mockResolvedValueOnce(JSON.stringify(mockSkillsData))
        .mockResolvedValueOnce(JSON.stringify(mockProjectsData))
        .mockResolvedValueOnce(JSON.stringify(mockWritingData));

      const result = await loadAllContent();

      expect(result).toEqual({
        person: mockPersonData,
        experience: mockExperienceData,
        skills: mockSkillsData,
        projects: mockProjectsData,
        writing: mockWritingData,
      });
    });

    it('should throw error if any content fails to load', async () => {
      mockFs.readFile
        .mockResolvedValueOnce(JSON.stringify(mockPersonData))
        .mockRejectedValueOnce(new Error('File not found'));

      await expect(loadAllContent()).rejects.toThrow('Failed to load all content: Failed to load content from /mock/path/data.json: File not found');
    });
  });

  describe('validateContent', () => {
    it('should validate content successfully', () => {
      const result = validateContent(mockPersonData, PersonPageDataSchema);
      expect(result).toEqual(mockPersonData);
    });

    it('should throw error for invalid content', () => {
      const invalidData = { person: { name: 'Invalid' } };

      expect(() => validateContent(invalidData, PersonPageDataSchema)).toThrow('Content validation failed');
    });
  });

  describe('Cache Management', () => {
    it('should cache content and return cached version', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockPersonData));

      // First call should read from file
      const result1 = await loadPersonContent();
      expect(result1).toEqual(mockPersonData);

      // Second call should use cache
      const result2 = await loadPersonContent();
      expect(result2).toEqual(mockPersonData);

      // Should only read file once
      expect(mockFs.readFile).toHaveBeenCalledTimes(1);
    });

    it('should clear cache successfully', () => {
      clearContentCache();
      const stats = getCacheStats();
      expect(stats.size).toBe(0);
    });

    it('should return cache statistics', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockPersonData));

      await loadPersonContent();
      const stats = getCacheStats();

      expect(stats.size).toBe(1);
      expect(stats.keys).toContain('person');
    });
  });

  describe('Utility Functions', () => {
    it('should check if content file exists', async () => {
      mockFs.access.mockResolvedValue(undefined);

      const exists = await contentFileExists('person');
      expect(exists).toBe(true);
      expect(mockPath.join).toHaveBeenCalledWith(process.cwd(), 'data', 'person.json');
    });

    it('should return false for non-existent file', async () => {
      mockFs.access.mockRejectedValue(new Error('File not found'));

      const exists = await contentFileExists('nonexistent');
      expect(exists).toBe(false);
    });

    it('should get content file path', () => {
      const filePath = getContentFilePath('person');
      expect(filePath).toBe('/mock/path/data.json');
      expect(mockPath.join).toHaveBeenCalledWith(process.cwd(), 'data', 'person.json');
    });

    it('should get content file modification time', async () => {
      const modTime = await getContentFileModTime('person');
      expect(modTime).toEqual(new Date('2024-12-15T10:00:00Z'));
      expect(mockPath.join).toHaveBeenCalledWith(process.cwd(), 'data', 'person.json');
    });

    it('should return null for non-existent file mod time', async () => {
      mockFs.stat.mockRejectedValue(new Error('File not found'));

      const modTime = await getContentFileModTime('nonexistent');
      expect(modTime).toBeNull();
    });
  });
}); 