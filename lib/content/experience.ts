import { loadExperienceContent, ExperiencePageData } from './loaders';

/**
 * Get experience data with validation
 * @returns Promise<ExperiencePageData> - Validated experience page data
 * @throws Error - If file cannot be read or validation fails
 */
export async function getExperienceData(): Promise<ExperiencePageData> {
  return loadExperienceContent();
}

/**
 * Get experience content from the page data
 * @returns Promise<ExperienceContent> - Experience content data
 * @throws Error - If file cannot be read or validation fails
 */
export async function getExperienceContent() {
  const data = await getExperienceData();
  return data.experience;
}

/**
 * Get work experience entries
 * @returns Promise<WorkExperience[]> - Array of work experience entries
 * @throws Error - If file cannot be read or validation fails
 */
export async function getWorkExperience() {
  const experience = await getExperienceContent();
  return experience.workExperience;
}

/**
 * Get featured work experience entries
 * @returns Promise<WorkExperience[]> - Featured work experience entries
 * @throws Error - If file cannot be read or validation fails
 */
export async function getFeaturedWorkExperience() {
  const workExperience = await getWorkExperience();
  return workExperience.filter(exp => exp.featured);
}

/**
 * Get current work experience (if any)
 * @returns Promise<WorkExperience | undefined> - Current work experience
 * @throws Error - If file cannot be read or validation fails
 */
export async function getCurrentWorkExperience() {
  const workExperience = await getWorkExperience();
  return workExperience.find(exp => exp.current);
}

/**
 * Get work experience by company
 * @param company - Company name to filter by
 * @returns Promise<WorkExperience[]> - Filtered work experience
 * @throws Error - If file cannot be read or validation fails
 */
export async function getWorkExperienceByCompany(company: string) {
  const workExperience = await getWorkExperience();
  return workExperience.filter(exp => 
    exp.company.toLowerCase().includes(company.toLowerCase())
  );
}

/**
 * Get work experience by industry
 * @param industry - Industry to filter by
 * @returns Promise<WorkExperience[]> - Filtered work experience
 * @throws Error - If file cannot be read or validation fails
 */
export async function getWorkExperienceByIndustry(industry: string) {
  const workExperience = await getWorkExperience();
  return workExperience.filter(exp => 
    exp.industry.toLowerCase().includes(industry.toLowerCase())
  );
}

/**
 * Get work experience by technology
 * @param technology - Technology name to filter by
 * @returns Promise<WorkExperience[]> - Filtered work experience
 * @throws Error - If file cannot be read or validation fails
 */
export async function getWorkExperienceByTechnology(technology: string) {
  const workExperience = await getWorkExperience();
  return workExperience.filter(exp => 
    exp.technologies.some(tech => 
      tech.name.toLowerCase().includes(technology.toLowerCase())
    )
  );
}

/**
 * Get education entries
 * @returns Promise<Education[]> - Array of education entries
 * @throws Error - If file cannot be read or validation fails
 */
export async function getEducation() {
  const experience = await getExperienceContent();
  return experience.education;
}

/**
 * Get featured education entries
 * @returns Promise<Education[]> - Featured education entries
 * @throws Error - If file cannot be read or validation fails
 */
export async function getFeaturedEducation() {
  const education = await getEducation();
  return education.filter(edu => edu.featured);
}

/**
 * Get current education (if any)
 * @returns Promise<Education | undefined> - Current education
 * @throws Error - If file cannot be read or validation fails
 */
export async function getCurrentEducation() {
  const education = await getEducation();
  return education.find(edu => edu.current);
}

/**
 * Get education by institution
 * @param institution - Institution name to filter by
 * @returns Promise<Education[]> - Filtered education
 * @throws Error - If file cannot be read or validation fails
 */
export async function getEducationByInstitution(institution: string) {
  const education = await getEducation();
  return education.filter(edu => 
    edu.institution.toLowerCase().includes(institution.toLowerCase())
  );
}

/**
 * Get certifications
 * @returns Promise<Certification[]> - Array of certifications
 * @throws Error - If file cannot be read or validation fails
 */
export async function getCertifications() {
  const experience = await getExperienceContent();
  return experience.certifications || [];
}

/**
 * Get featured certifications
 * @returns Promise<Certification[]> - Featured certifications
 * @throws Error - If file cannot be read or validation fails
 */
export async function getFeaturedCertifications() {
  const certifications = await getCertifications();
  return certifications.filter(cert => cert.featured);
}

/**
 * Get certifications by issuer
 * @param issuer - Issuer name to filter by
 * @returns Promise<Certification[]> - Filtered certifications
 * @throws Error - If file cannot be read or validation fails
 */
export async function getCertificationsByIssuer(issuer: string) {
  const certifications = await getCertifications();
  return certifications.filter(cert => 
    cert.issuer.toLowerCase().includes(issuer.toLowerCase())
  );
}

/**
 * Get total experience summary
 * @returns Promise<object> - Total experience information
 * @throws Error - If file cannot be read or validation fails
 */
export async function getTotalExperience() {
  const experience = await getExperienceContent();
  return experience.totalExperience;
}

/**
 * Get skills summary
 * @returns Promise<string[]> - Array of skills summary
 * @throws Error - If file cannot be read or validation fails
 */
export async function getSkillsSummary() {
  const experience = await getExperienceContent();
  return experience.skillsSummary;
}

/**
 * Get experience summary text
 * @returns Promise<string> - Experience summary
 * @throws Error - If file cannot be read or validation fails
 */
export async function getExperienceSummary() {
  const experience = await getExperienceContent();
  return experience.summary;
}

/**
 * Get experience SEO metadata
 * @returns Promise<object> - SEO metadata
 * @throws Error - If file cannot be read or validation fails
 */
export async function getExperienceSEO() {
  const experience = await getExperienceContent();
  return {
    metaTitle: experience.metaTitle,
    metaDescription: experience.metaDescription,
    socialImage: experience.socialImage,
  };
}

/**
 * Sort work experience by start date (newest first)
 * @param workExperience - Array of work experience entries
 * @returns WorkExperience[] - Sorted work experience
 */
export function sortWorkExperienceByDate(workExperience: any[]) {
  return [...workExperience].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

/**
 * Sort education by start date (newest first)
 * @param education - Array of education entries
 * @returns Education[] - Sorted education
 */
export function sortEducationByDate(education: any[]) {
  return [...education].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

/**
 * Sort certifications by issue date (newest first)
 * @param certifications - Array of certification entries
 * @returns Certification[] - Sorted certifications
 */
export function sortCertificationsByDate(certifications: any[]) {
  return [...certifications].sort((a, b) => 
    new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
  );
}

// Export types for convenience
export type { ExperiencePageData } from './loaders'; 