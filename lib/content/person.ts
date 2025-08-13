import { loadPersonContent, PersonPageData } from './loaders';

/**
 * Get person data with validation
 * @returns Promise<PersonPageData> - Validated person page data
 * @throws Error - If file cannot be read or validation fails
 */
export async function getPersonData(): Promise<PersonPageData> {
  return loadPersonContent();
}

/**
 * Get person content from the page data
 * @returns Promise<PersonContent> - Person content data
 * @throws Error - If file cannot be read or validation fails
 */
export async function getPersonContent() {
  const data = await getPersonData();
  return data.person;
}

/**
 * Get person's basic information
 * @returns Promise<object> - Basic person information
 * @throws Error - If file cannot be read or validation fails
 */
export async function getPersonBasicInfo() {
  const person = await getPersonContent();
  return {
    name: person.name,
    title: person.title,
    email: person.email,
    phone: person.phone,
    summary: person.summary,
    location: person.location,
  };
}

/**
 * Get person's social links
 * @returns Promise<SocialLink[]> - Array of social links
 * @throws Error - If file cannot be read or validation fails
 */
export async function getPersonSocialLinks() {
  const person = await getPersonContent();
  return person.social;
}

/**
 * Get person's skills
 * @returns Promise<Skill[]> - Array of skills
 * @throws Error - If file cannot be read or validation fails
 */
export async function getPersonSkills() {
  const person = await getPersonContent();
  return person.skills;
}

/**
 * Get featured skills from person data
 * @returns Promise<Skill[]> - Featured skills only
 * @throws Error - If file cannot be read or validation fails
 */
export async function getFeaturedSkills() {
  const skills = await getPersonSkills();
  return skills.filter(skill => skill.featured);
}

/**
 * Get skills by category
 * @param category - Category to filter by
 * @returns Promise<Skill[]> - Filtered skills
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsByCategory(category: string) {
  const skills = await getPersonSkills();
  return skills.filter(skill => skill.category === category);
}

/**
 * Get skills by proficiency level
 * @param proficiency - Proficiency level to filter by
 * @returns Promise<Skill[]> - Filtered skills
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsByProficiency(proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert') {
  const skills = await getPersonSkills();
  return skills.filter(skill => skill.proficiency === proficiency);
}

/**
 * Get person's availability status
 * @returns Promise<Availability | undefined> - Availability information
 * @throws Error - If file cannot be read or validation fails
 */
export async function getPersonAvailability() {
  const person = await getPersonContent();
  return person.availability;
}

/**
 * Get person's experience summary
 * @returns Promise<object> - Experience information
 * @throws Error - If file cannot be read or validation fails
 */
export async function getPersonExperience() {
  const person = await getPersonContent();
  return person.experience;
}

/**
 * Get person's SEO metadata
 * @returns Promise<object> - SEO metadata
 * @throws Error - If file cannot be read or validation fails
 */
export async function getPersonSEO() {
  const person = await getPersonContent();
  return {
    metaTitle: person.metaTitle,
    metaDescription: person.metaDescription,
    socialImage: person.socialImage,
  };
}

/**
 * Check if person is available for work
 * @returns Promise<boolean> - Whether person is available
 * @throws Error - If file cannot be read or validation fails
 */
export async function isPersonAvailable(): Promise<boolean> {
  const availability = await getPersonAvailability();
  return availability?.status === 'available';
}

/**
 * Get person's response time
 * @returns Promise<string | undefined> - Response time information
 * @throws Error - If file cannot be read or validation fails
 */
export async function getPersonResponseTime(): Promise<string | undefined> {
  const availability = await getPersonAvailability();
  return availability?.responseTime;
}

// Export types for convenience
export type { PersonPageData } from './loaders'; 