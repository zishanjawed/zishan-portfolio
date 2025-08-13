export interface WritingContent {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'external' | 'iframe' | 'blog';
  publishedDate: string;
  readTime?: number; // in minutes
  tags?: string[];
  featured?: boolean;
  thumbnail?: string;
  author?: string;
  source?: string;
}

export interface WritingPageData {
  title: string;
  description: string;
  writings: WritingContent[];
  totalCount: number;
}

export interface WritingCardProps {
  writing: WritingContent;
  className?: string;
}

export interface WritingGridProps {
  writings: WritingContent[];
  className?: string;
} 