import { z } from 'zod';

// Import all schemas
import { PersonPageDataSchema, PersonContentSchema } from '../../schemas/person';
import { ExperiencePageDataSchema, ExperienceContentSchema } from '../../schemas/experience';
import { SkillsPageDataSchema, SkillsContentSchema } from '../../schemas/skills';
import { ProjectsPageDataSchema, ProjectsPageData } from '../../schemas/projects';
import { WritingPageDataSchema, WritingPageData } from '../../schemas/writing';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: any;
}

/**
 * Content validation error with context
 */
export interface ContentValidationError {
  path: string;
  message: string;
  code: string;
  received?: any;
}

/**
 * Validate content with detailed error reporting
 * @param content - Content data to validate
 * @param schema - Zod schema for validation
 * @returns ValidationResult - Detailed validation result
 */
export function validateContentWithDetails<T>(
  content: any,
  schema: z.ZodSchema<T>
): ValidationResult {
  const result: ValidationResult = {
    isValid: false,
    errors: [],
    warnings: [],
  };

  try {
    const validatedData = schema.parse(content);
    result.isValid = true;
    result.data = validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      result.errors = error.errors.map(err => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });
    } else if (error instanceof Error) {
      result.errors.push(error.message);
    } else {
      result.errors.push('Unknown validation error');
    }
  }

  return result;
}

/**
 * Validate person content
 * @param content - Person content data
 * @returns ValidationResult - Validation result
 */
export function validatePersonContent(content: any): ValidationResult {
  return validateContentWithDetails(content, PersonContentSchema);
}

/**
 * Validate person page data
 * @param content - Person page data
 * @returns ValidationResult - Validation result
 */
export function validatePersonPageData(content: any): ValidationResult {
  return validateContentWithDetails(content, PersonPageDataSchema);
}

/**
 * Validate experience content
 * @param content - Experience content data
 * @returns ValidationResult - Validation result
 */
export function validateExperienceContent(content: any): ValidationResult {
  return validateContentWithDetails(content, ExperienceContentSchema);
}

/**
 * Validate experience page data
 * @param content - Experience page data
 * @returns ValidationResult - Validation result
 */
export function validateExperiencePageData(content: any): ValidationResult {
  return validateContentWithDetails(content, ExperiencePageDataSchema);
}

/**
 * Validate skills content
 * @param content - Skills content data
 * @returns ValidationResult - Validation result
 */
export function validateSkillsContent(content: any): ValidationResult {
  return validateContentWithDetails(content, SkillsContentSchema);
}

/**
 * Validate skills page data
 * @param content - Skills page data
 * @returns ValidationResult - Validation result
 */
export function validateSkillsPageData(content: any): ValidationResult {
  return validateContentWithDetails(content, SkillsPageDataSchema);
}

/**
 * Validate projects page data
 * @param content - Projects page data
 * @returns ValidationResult - Validation result
 */
export function validateProjectsPageData(content: any): ValidationResult {
  return validateContentWithDetails(content, ProjectsPageDataSchema);
}

/**
 * Validate writing page data
 * @param content - Writing page data
 * @returns ValidationResult - Validation result
 */
export function validateWritingPageData(content: any): ValidationResult {
  return validateContentWithDetails(content, WritingPageDataSchema);
}

/**
 * Validate all content types
 * @param contentMap - Map of content types to content data
 * @returns Record<string, ValidationResult> - Validation results for each content type
 */
export function validateAllContent(contentMap: Record<string, any>): Record<string, ValidationResult> {
  const validators: Record<string, (content: any) => ValidationResult> = {
    person: validatePersonPageData,
    experience: validateExperiencePageData,
    skills: validateSkillsPageData,
    projects: validateProjectsPageData,
    writing: validateWritingPageData,
  };

  const results: Record<string, ValidationResult> = {};

  for (const [contentType, content] of Object.entries(contentMap)) {
    const validator = validators[contentType];
    if (validator) {
      results[contentType] = validator(content);
    } else {
      results[contentType] = {
        isValid: false,
        errors: [`Unknown content type: ${contentType}`],
        warnings: [],
      };
    }
  }

  return results;
}

/**
 * Check for common content issues and provide warnings
 * @param content - Content data to check
 * @param contentType - Type of content being checked
 * @returns string[] - Array of warning messages
 */
export function checkContentWarnings(content: any, contentType: string): string[] {
  const warnings: string[] = [];

  // Generic checks
  if (!content) {
    warnings.push('Content is null or undefined');
    return warnings;
  }

  // Check for missing required SEO fields
  if (content.metaTitle && content.metaTitle.length > 60) {
    warnings.push('Meta title is longer than recommended 60 characters');
  }

  if (content.metaDescription && content.metaDescription.length > 160) {
    warnings.push('Meta description is longer than recommended 160 characters');
  }

  // Content-specific checks
  switch (contentType) {
    case 'person':
      if (content.person?.social && content.person.social.length === 0) {
        warnings.push('No social links provided');
      }
      if (content.person?.skills && content.person.skills.length === 0) {
        warnings.push('No skills provided');
      }
      break;

    case 'experience':
      if (content.experience?.workExperience && content.experience.workExperience.length === 0) {
        warnings.push('No work experience entries provided');
      }
      if (content.experience?.education && content.experience.education.length === 0) {
        warnings.push('No education entries provided');
      }
      break;

    case 'skills':
      if (content.skills?.skills && content.skills.skills.length === 0) {
        warnings.push('No skills provided');
      }
      if (content.skills?.categories && content.skills.categories.length === 0) {
        warnings.push('No skill categories provided');
      }
      break;

    case 'projects':
      if (content.projects && content.projects.length === 0) {
        warnings.push('No projects provided');
      }
      break;

    case 'writing':
      if (content.writings && content.writings.length === 0) {
        warnings.push('No writing entries provided');
      }
      break;
  }

  return warnings;
}

/**
 * Validate content structure and provide suggestions
 * @param content - Content data to analyze
 * @param contentType - Type of content being analyzed
 * @returns object - Analysis result with suggestions
 */
export function analyzeContentStructure(content: any, contentType: string): {
  isValid: boolean;
  suggestions: string[];
  missingFields: string[];
  extraFields: string[];
} {
  const result = {
    isValid: true,
    suggestions: [] as string[],
    missingFields: [] as string[],
    extraFields: [] as string[],
  };

  // Define expected fields for each content type
  const expectedFields: Record<string, string[]> = {
    person: ['person', 'metaTitle', 'metaDescription', 'lastUpdated', 'trackingEnabled'],
    experience: ['experience', 'metaTitle', 'metaDescription', 'lastUpdated', 'trackingEnabled'],
    skills: ['skills', 'metaTitle', 'metaDescription', 'lastUpdated', 'trackingEnabled'],
    projects: ['projects', 'metaTitle', 'metaDescription', 'lastUpdated', 'trackingEnabled'],
    writing: ['writings', 'metaTitle', 'metaDescription', 'lastUpdated', 'trackingEnabled'],
  };

  const expected = expectedFields[contentType] || [];
  const actual = Object.keys(content || {});

  // Check for missing fields
  for (const field of expected) {
    if (!actual.includes(field)) {
      result.missingFields.push(field);
      result.isValid = false;
    }
  }

  // Check for extra fields
  for (const field of actual) {
    if (!expected.includes(field)) {
      result.extraFields.push(field);
    }
  }

  // Generate suggestions
  if (result.missingFields.length > 0) {
    result.suggestions.push(`Add missing fields: ${result.missingFields.join(', ')}`);
  }

  if (result.extraFields.length > 0) {
    result.suggestions.push(`Consider removing extra fields: ${result.extraFields.join(', ')}`);
  }

  return result;
}

/**
 * Format validation errors for display
 * @param errors - Array of error messages
 * @returns string - Formatted error message
 */
export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 0) {
    return 'No validation errors found.';
  }

  if (errors.length === 1) {
    return `Validation error: ${errors[0]}`;
  }

  return `Validation errors:\n${errors.map((error, index) => `${index + 1}. ${error}`).join('\n')}`;
}

/**
 * Validate content file format
 * @param fileContent - Raw file content as string
 * @returns ValidationResult - Validation result
 */
export function validateContentFileFormat(fileContent: string): ValidationResult {
  const result: ValidationResult = {
    isValid: false,
    errors: [],
    warnings: [],
  };

  try {
    // Check if content is valid JSON
    const parsed = JSON.parse(fileContent);
    result.isValid = true;
    result.data = parsed;

    // Check for common JSON issues
    if (typeof parsed !== 'object' || parsed === null) {
      result.errors.push('Content must be a JSON object');
      result.isValid = false;
    }

    // Check for empty object
    if (Object.keys(parsed).length === 0) {
      result.warnings.push('Content object is empty');
    }

  } catch (error) {
    if (error instanceof SyntaxError) {
      result.errors.push(`Invalid JSON format: ${error.message}`);
    } else {
      result.errors.push('Failed to parse JSON content');
    }
  }

  return result;
}

/**
 * Get content validation summary
 * @param validationResults - Map of content types to validation results
 * @returns object - Summary of validation results
 */
export function getValidationSummary(validationResults: Record<string, ValidationResult>): {
  totalContentTypes: number;
  validContentTypes: number;
  invalidContentTypes: number;
  totalErrors: number;
  totalWarnings: number;
  validTypes: string[];
  invalidTypes: string[];
} {
  const summary = {
    totalContentTypes: Object.keys(validationResults).length,
    validContentTypes: 0,
    invalidContentTypes: 0,
    totalErrors: 0,
    totalWarnings: 0,
    validTypes: [] as string[],
    invalidTypes: [] as string[],
  };

  for (const [contentType, result] of Object.entries(validationResults)) {
    if (result.isValid) {
      summary.validContentTypes++;
      summary.validTypes.push(contentType);
    } else {
      summary.invalidContentTypes++;
      summary.invalidTypes.push(contentType);
    }

    summary.totalErrors += result.errors.length;
    summary.totalWarnings += result.warnings.length;
  }

  return summary;
} 