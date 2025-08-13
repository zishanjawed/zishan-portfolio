import { z } from 'zod';
import { PersonContentSchema } from '@/schemas/person';
import { ExperienceContentSchema } from '@/schemas/experience';
import { ProjectsContentSchema } from '@/schemas/projects';
import { SkillsContentSchema } from '@/schemas/skills';
import { WritingContentSchema } from '@/schemas/writing';
import { ContentType } from '@/components/content/content-management-client';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationWarning {
  path: string;
  message: string;
}

function getSchemaForType(contentType: ContentType): z.ZodSchema {
  switch (contentType) {
    case 'person':
      return PersonContentSchema;
    case 'experience':
      return ExperienceContentSchema;
    case 'projects':
      return ProjectsContentSchema;
    case 'skills':
      return SkillsContentSchema;
    case 'writing':
      return WritingContentSchema;
    default:
      throw new Error(`Unknown content type: ${contentType}`);
  }
}

export function validateContent(contentType: ContentType, data: any): ValidationResult {
  const schema = getSchemaForType(contentType);
  
  try {
    schema.parse(data);
    return { isValid: true, errors: [], warnings: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        })),
        warnings: []
      };
    }
    return {
      isValid: false,
      errors: [{ path: '', message: 'Unknown validation error' }],
      warnings: []
    };
  }
}

export function validateContentField(contentType: ContentType, path: string, value: any): ValidationResult {
  const schema = getSchemaForType(contentType);
  
  try {
    // Create a partial schema for the specific field
    const fieldSchema = z.object({
      [path]: schema.shape[path as keyof typeof schema.shape]
    });
    
    fieldSchema.parse({ [path]: value });
    return { isValid: true, errors: [], warnings: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        })),
        warnings: []
      };
    }
    return {
      isValid: false,
      errors: [{ path, message: 'Unknown validation error' }],
      warnings: []
    };
  }
} 