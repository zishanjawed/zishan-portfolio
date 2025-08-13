import React, { useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ExternalLink, Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { ProjectContent } from '../../schemas/projects';
import { trackExternalLink } from '../../lib/analytics';

interface ProjectDrawerProps {
  project: ProjectContent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDrawer({ project, isOpen, onClose }: ProjectDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = formatDate(startDate);
    if (endDate) {
      const end = formatDate(endDate);
      return `${start} - ${end}`;
    }
    return `${start} - Present`;
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

  const handleLinkClick = (url: string, label: string) => {
    trackExternalLink(url, label, 'project-drawer');
  };

  if (!project) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-900 shadow-xl z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <span className="text-2xl" aria-hidden="true">
                  {getCategoryIcon(project.category)}
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {project.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {project.category.replace('-', ' ')}
                  </p>
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  ref={closeButtonRef}
                  className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close project details"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Project Overview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Project Overview
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Client:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {project.client}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDateRange(project.startDate, project.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  {project.teamSize && (
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Team Size:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.teamSize} people
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Role:</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {project.role}
                    </p>
                  </div>
                  {project.responsibilities && (
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Responsibilities:</span>
                      <ul className="mt-1 space-y-1">
                        {project.responsibilities.map((responsibility, index) => (
                          <li key={index} className="text-sm text-gray-900 dark:text-white flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Technologies Used
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.technologies.map((tech, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {tech.icon && (
                        <img src={tech.icon} alt="" className="h-4 w-4" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {tech.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {tech.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              {project.metrics && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {project.metrics.users && (
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {project.metrics.users.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Users</p>
                      </div>
                    )}
                    {project.metrics.transactions && (
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {project.metrics.transactions.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
                      </div>
                    )}
                    {project.metrics.performance && (
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {project.metrics.performance}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Performance</p>
                      </div>
                    )}
                    {project.metrics.uptime && (
                      <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          {project.metrics.uptime}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Case Study */}
              {project.caseStudy && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Case Study
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Overview</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {project.caseStudy.overview}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Challenge</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {project.caseStudy.challenge}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Solution</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {project.caseStudy.solution}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Results</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {project.caseStudy.results}
                      </p>
                    </div>
                    {project.caseStudy.lessons && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Lessons</h4>
                        <ul className="space-y-1">
                          {project.caseStudy.lessons.map((lesson, index) => (
                            <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              {lesson}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Links */}
              {project.links && project.links.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Project Links
                  </h3>
                  <div className="space-y-2">
                    {project.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        onClick={() => handleLinkClick(link.url, link.label)}
                        className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {link.label}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 