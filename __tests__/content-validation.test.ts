import { describe, it, expect } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { PersonPageDataSchema } from '../schemas/person';
import { ExperiencePageDataSchema } from '../schemas/experience';
import { SkillsPageDataSchema } from '../schemas/skills';
import { ProjectsPageDataSchema } from '../schemas/projects';
import { WritingPageDataSchema } from '../schemas/writing';

describe('Content Data Validation', () => {
  const dataDir = path.join(process.cwd(), 'data');

  describe('Person Data', () => {
    it('should validate person.json against schema', async () => {
      const filePath = path.join(dataDir, 'person.json');
      const rawData = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(rawData);
      
      const result = PersonPageDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Experience Data', () => {
    it('should validate experience.json against schema', async () => {
      const filePath = path.join(dataDir, 'experience.json');
      const rawData = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(rawData);
      
      const result = ExperiencePageDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Skills Data', () => {
    it('should validate skills.json against schema', async () => {
      const filePath = path.join(dataDir, 'skills.json');
      const rawData = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(rawData);
      
      const result = SkillsPageDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Projects Data', () => {
    it('should validate projects.json against schema', async () => {
      const filePath = path.join(dataDir, 'projects.json');
      const rawData = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(rawData);
      
      const result = ProjectsPageDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Writing Data', () => {
    it('should validate writing.json against schema', async () => {
      const filePath = path.join(dataDir, 'writing.json');
      const rawData = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(rawData);
      
      const result = WritingPageDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
}); 