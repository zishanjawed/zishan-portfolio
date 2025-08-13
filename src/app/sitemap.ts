import { MetadataRoute } from 'next';
import projectsData from '../../data/projects.json';
import writingData from '../../data/writing.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zishanjawed.com';
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/writing`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Project pages
  const projectPages = projectsData.projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: project.endDate || currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Writing pages
  const writingPages = writingData.writings.map((writing) => ({
    url: `${baseUrl}/writing/${writing.id}`,
    lastModified: writing.publishedDate || currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages, ...writingPages];
} 