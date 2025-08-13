import { loadSkillsContent, SkillsPageData } from './loaders';

/**
 * Get skills data with validation
 * @returns Promise<SkillsPageData> - Validated skills page data
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsData(): Promise<SkillsPageData> {
  return loadSkillsContent();
}

/**
 * Get skills content from the page data
 * @returns Promise<SkillsContent> - Skills content data
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsContent() {
  const data = await getSkillsData();
  return data.skills;
}

/**
 * Get all skills
 * @returns Promise<Skill[]> - Array of all skills
 * @throws Error - If file cannot be read or validation fails
 */
export async function getAllSkills() {
  const skills = await getSkillsContent();
  return skills.skills;
}

/**
 * Get featured skills
 * @returns Promise<Skill[]> - Featured skills only
 * @throws Error - If file cannot be read or validation fails
 */
export async function getFeaturedSkills() {
  const skills = await getAllSkills();
  return skills.filter(skill => skill.featured);
}

/**
 * Get skills by category
 * @param category - Category to filter by
 * @returns Promise<Skill[]> - Filtered skills
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsByCategory(category: string) {
  const skills = await getAllSkills();
  return skills.filter(skill => skill.category === category);
}

/**
 * Get skills by proficiency level
 * @param proficiency - Proficiency level to filter by
 * @returns Promise<Skill[]> - Filtered skills
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsByProficiency(proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert') {
  const skills = await getAllSkills();
  return skills.filter(skill => skill.proficiency === proficiency);
}

/**
 * Get skills by years of experience
 * @param minYears - Minimum years of experience
 * @param maxYears - Maximum years of experience (optional)
 * @returns Promise<Skill[]> - Filtered skills
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsByExperience(minYears: number, maxYears?: number) {
  const skills = await getAllSkills();
  return skills.filter(skill => {
    if (maxYears) {
      return skill.yearsOfExperience >= minYears && skill.yearsOfExperience <= maxYears;
    }
    return skill.yearsOfExperience >= minYears;
  });
}

/**
 * Get skills by tags
 * @param tags - Array of tags to filter by
 * @returns Promise<Skill[]> - Filtered skills
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsByTags(tags: string[]) {
  const skills = await getAllSkills();
  return skills.filter(skill => 
    skill.tags && tags.some(tag => 
      skill.tags!.some(skillTag => 
        skillTag.toLowerCase().includes(tag.toLowerCase())
      )
    )
  );
}

/**
 * Get skill categories
 * @returns Promise<SkillCategory[]> - Array of skill categories
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillCategories() {
  const skills = await getSkillsContent();
  return skills.categories;
}

/**
 * Get skill category by ID
 * @param categoryId - Category ID to find
 * @returns Promise<SkillCategory | undefined> - Skill category
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillCategoryById(categoryId: string) {
  const categories = await getSkillCategories();
  return categories.find(category => category.id === categoryId);
}

/**
 * Get skill levels
 * @returns Promise<SkillLevel[]> - Array of skill levels
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillLevels() {
  const skills = await getSkillsContent();
  return skills.levels;
}

/**
 * Get skill level by level name
 * @param level - Level name to find
 * @returns Promise<SkillLevel | undefined> - Skill level
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillLevelByName(level: 'beginner' | 'intermediate' | 'advanced' | 'expert') {
  const levels = await getSkillLevels();
  return levels.find(l => l.level === level);
}

/**
 * Get skills summary statistics
 * @returns Promise<object> - Skills summary statistics
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsSummary() {
  const skills = await getSkillsContent();
  return skills.summary;
}

/**
 * Get skills by category mapping
 * @returns Promise<Record<string, string[]>> - Skills grouped by category
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsByCategoryMapping() {
  const skills = await getSkillsContent();
  return skills.skillsByCategory || {};
}

/**
 * Get skills for a specific project
 * @param projectId - Project ID to filter by
 * @returns Promise<Skill[]> - Skills used in the project
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsForProject(projectId: string) {
  const skills = await getAllSkills();
  return skills.filter(skill => 
    skill.projects && skill.projects.includes(projectId)
  );
}

/**
 * Get skills with certifications
 * @returns Promise<Skill[]> - Skills that have certifications
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsWithCertifications() {
  const skills = await getAllSkills();
  return skills.filter(skill => 
    skill.certifications && skill.certifications.length > 0
  );
}

/**
 * Get skills sorted by years of experience (highest first)
 * @returns Promise<Skill[]> - Sorted skills
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsSortedByExperience() {
  const skills = await getAllSkills();
  return skills.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
}

/**
 * Get skills sorted by order
 * @returns Promise<Skill[]> - Sorted skills
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsSortedByOrder() {
  const skills = await getAllSkills();
  return skills.sort((a, b) => a.order - b.order);
}

/**
 * Get skills sorted by last used date (most recent first)
 * @returns Promise<Skill[]> - Sorted skills
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsSortedByLastUsed() {
  const skills = await getAllSkills();
  return skills
    .filter(skill => skill.lastUsed)
    .sort((a, b) => 
      new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime()
    );
}

/**
 * Get skills summary for display
 * @returns Promise<object> - Formatted skills summary
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsDisplaySummary() {
  const summary = await getSkillsSummary();
  const levels = await getSkillLevels();
  
  return {
    totalSkills: summary.totalSkills,
    categories: summary.categories,
    yearsOfExperience: summary.yearsOfExperience,
    proficiencyBreakdown: {
      expert: { count: summary.expertSkills, level: levels.find(l => l.level === 'expert') },
      advanced: { count: summary.advancedSkills, level: levels.find(l => l.level === 'advanced') },
      intermediate: { count: summary.intermediateSkills, level: levels.find(l => l.level === 'intermediate') },
      beginner: { count: summary.beginnerSkills, level: levels.find(l => l.level === 'beginner') },
    }
  };
}

/**
 * Get skills SEO metadata
 * @returns Promise<object> - SEO metadata
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsSEO() {
  const skills = await getSkillsContent();
  return {
    metaTitle: skills.metaTitle,
    metaDescription: skills.metaDescription,
    socialImage: skills.socialImage,
  };
}

// Export types for convenience
export type { SkillsPageData } from './loaders'; 