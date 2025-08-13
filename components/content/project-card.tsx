import React, { useState } from 'react';
import Image from 'next/image';
import { ProjectContent } from '../../schemas/projects';
import { trackExternalLink, trackProjectInteraction } from '../../lib/analytics';

interface ProjectCardProps {
  project: ProjectContent;
  className?: string;
  onClick?: (project: ProjectContent) => void;
}

export function ProjectCard({ project, className = '', onClick }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'on-hold':
        return 'On Hold';
      case 'archived':
        return 'Archived';
      default:
        return 'Unknown';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fintech':
        return '💰';
      case 'ecommerce':
        return '🛒';
      case 'saas':
        return '☁️';
      case 'web-app':
        return '🌐';
      case 'mobile-app':
        return '📱';
      case 'api':
        return '🔌';
      case 'open-source':
        return '📦';
      default:
        return '📋';
    }
  };

  const handleCardClick = () => {
    // Track project interaction
    trackProjectInteraction(project.title, 'click');
    
    if (onClick) {
      onClick(project);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  const handleExternalLinkClick = (url: string, title: string) => {
    trackExternalLink(url, title, 'project_card');
  };

  return (
    <article 
      className={`group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer ${className}`}
      aria-labelledby={`project-title-${project.id}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-describedby={`project-description-${project.id}`}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Featured
          </span>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
          {getStatusLabel(project.status)}
        </span>
      </div>

      {/* Thumbnail */}
      {project.thumbnail && !imageError && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={`Thumbnail for ${project.title}`}
            fill={true}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg" aria-hidden="true">
              {getCategoryIcon(project.category)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {project.category.replace('-', ' ')}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(project.startDate)}
          </span>
        </div>

        {/* Title */}
        <h3 
          id={`project-title-${project.id}`}
          className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
        >
          {project.title}
        </h3>

        {/* Description */}
        <p 
          id={`project-description-${project.id}`}
          className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3"
        >
          {project.shortDescription}
        </p>

        {/* Client */}
        <div className="mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">Client:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
            {project.client}
          </span>
        </div>

        {/* Technologies */}
        <div className="mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">Technologies:</span>
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 4).map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              >
                {tech.name}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Metrics (if available) */}
        {project.metrics && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {project.metrics.users && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Users:</span>
                  <span className="font-medium text-gray-900 dark:text-white ml-1">
                    {project.metrics.users.toLocaleString()}
                  </span>
                </div>
              )}
              {project.metrics.performance && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Performance:</span>
                  <span className="font-medium text-gray-900 dark:text-white ml-1">
                    {project.metrics.performance}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Role */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">Role:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
            {project.role}
          </span>
        </div>

        {/* External Links */}
        {project.links && project.links.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {project.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExternalLinkClick(link.url, `${project.title} - ${link.label}`);
                  }}
                  className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 pointer-events-none" />
    </article>
  );
} 