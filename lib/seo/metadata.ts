import type { Metadata } from "next";
import projectsData from "../../data/projects.json";
import writingData from "../../data/writing.json";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const baseUrl = "https://zishanjawed.com";
  const fullUrl = config.url ? `${baseUrl}${config.url}` : baseUrl;
  const imageUrl = config.image ? `${baseUrl}${config.image}` : `${baseUrl}/og-image.png`;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords || [
      "backend engineer",
      "fintech",
      "payment systems",
      "Node.js",
      "Python",
      "microservices",
      "scalable architecture"
    ],
    openGraph: {
      title: config.title,
      description: config.description,
      url: fullUrl,
      siteName: "Zishan Jawed",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: "en_US",
      type: config.type || "website",
      ...(config.publishedTime && { publishedTime: config.publishedTime }),
      ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
      ...(config.author && { authors: [{ name: config.author }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [imageUrl],
      site: "@zishanjawed",
      creator: "@zishanjawed",
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

export function generateProjectMetadata(projectId: string): Metadata {
  const project = projectsData.projects.find(p => p.id === projectId);
  
  if (!project) {
    return generateMetadata({
      title: "Project Not Found",
      description: "The requested project could not be found.",
      url: `/projects/${projectId}`,
    });
  }

  return generateMetadata({
    title: project.metaTitle || project.title,
    description: project.metaDescription || project.description,
    keywords: [
      ...project.technologies.map(t => t.name),
      project.category,
      "backend engineering",
      "fintech",
      "case study"
    ],
    image: project.socialImage || project.thumbnail,
    url: `/projects/${project.id}`,
    type: "article",
    publishedTime: project.startDate,
    modifiedTime: project.endDate,
    author: "Zishan Jawed",
  });
}

export function generateWritingMetadata(writingId: string): Metadata {
  const writing = writingData.writings.find(w => w.id === writingId);
  
  if (!writing) {
    return generateMetadata({
      title: "Article Not Found",
      description: "The requested article could not be found.",
      url: `/writing/${writingId}`,
    });
  }

  return generateMetadata({
    title: writing.metaTitle || writing.title,
    description: writing.metaDescription || writing.description,
    keywords: [
      ...writing.tags,
      "backend engineering",
      "technical writing",
      "blog post"
    ],
    image: writing.socialImage,
    url: `/writing/${writing.id}`,
    type: "article",
    publishedTime: writing.publishedDate,
    author: writing.author,
  });
}

export function generateProjectsPageMetadata(): Metadata {
  return generateMetadata({
    title: projectsData.metaTitle,
    description: projectsData.metaDescription,
    keywords: [
      "projects",
      "case studies",
      "portfolio",
      "backend engineering",
      "fintech",
      "ecommerce",
      "saas"
    ],
    image: projectsData.socialImage,
    url: "/projects",
    type: "website",
  });
}

export function generateWritingPageMetadata(): Metadata {
  return generateMetadata({
    title: writingData.metaTitle,
    description: writingData.metaDescription,
    keywords: [
      "writing",
      "articles",
      "blog posts",
      "technical writing",
      "backend engineering",
      "fintech"
    ],
    image: writingData.socialImage,
    url: "/writing",
    type: "website",
  });
}

export function generateContactPageMetadata(): Metadata {
  return generateMetadata({
    title: "Contact - Zishan Jawed",
    description: "Get in touch with Zishan Jawed for backend engineering, fintech consulting, and technical collaboration opportunities.",
    keywords: [
      "contact",
      "consulting",
      "backend engineering",
      "fintech",
      "collaboration"
    ],
    url: "/contact",
    type: "website",
  });
}

export function generateHomePageMetadata(): Metadata {
  return generateMetadata({
    title: "Zishan Jawed - Backend Engineer & Fintech Specialist",
    description: "Backend engineer specializing in fintech, payment systems, and scalable architecture. Expert in Node.js, Python, and cloud technologies with experience building high-performance systems.",
    keywords: [
      "backend engineer",
      "fintech",
      "payment systems",
      "Node.js",
      "Python",
      "microservices",
      "scalable architecture",
      "cloud computing",
      "AWS",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Kubernetes"
    ],
    url: "/",
    type: "website",
  });
} 