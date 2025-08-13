'use client';

import { ContentType } from './content-management-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Briefcase, 
  FolderOpen, 
  Code, 
  FileText,
  ExternalLink,
  Calendar,
  MapPin,
  Star
} from 'lucide-react';

interface ContentPreviewProps {
  contentType: ContentType;
  data: any;
}

export function ContentPreview({ contentType, data }: ContentPreviewProps) {
  const renderPersonPreview = () => {
    if (!data) return <div className="text-gray-500">No data to preview</div>;

    return (
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
            <p className="text-xl text-gray-600">{data.title}</p>
            <p className="text-gray-500">{data.email}</p>
            {data.phone && <p className="text-gray-500">{data.phone}</p>}
          </div>

          {data.location && (
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>{data.location.city}, {data.location.country}</span>
            </div>
          )}
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </div>
        )}

        {/* Bio */}
        {data.bio && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">About</h2>
            <p className="text-gray-700 leading-relaxed">{data.bio}</p>
          </div>
        )}

        {/* Social Links */}
        {data.social && data.social.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
            <div className="flex flex-wrap gap-2">
              {data.social.map((social: any, index: number) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <span className="text-sm font-medium">{social.platform}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: any, index: number) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Availability */}
        {data.availability && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Availability</h2>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={data.availability.status === 'available' ? 'default' : 'secondary'}
              >
                {data.availability.status}
              </Badge>
              {data.availability.message && (
                <span className="text-gray-600">{data.availability.message}</span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderExperiencePreview = () => {
    if (!data) return <div className="text-gray-500">No data to preview</div>;

    return (
      <div className="space-y-6">
        {/* Work Experience */}
        {data.workExperience && data.workExperience.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
            <div className="space-y-4">
              {data.workExperience.map((job: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-blue-600 font-medium">{job.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>{job.startDate} - {job.endDate || 'Present'}</div>
                          <div>{job.location}</div>
                        </div>
                      </div>
                      {job.description && (
                        <p className="text-gray-700 text-sm">{job.description}</p>
                      )}
                      {job.technologies && job.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {job.technologies.map((tech: string, techIndex: number) => (
                            <Badge key={techIndex} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-blue-600 font-medium">{edu.institution}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>{edu.startDate} - {edu.endDate || 'Present'}</div>
                          <div>{edu.location}</div>
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-gray-700 text-sm">{edu.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProjectsPreview = () => {
    if (!data || !Array.isArray(data)) return <div className="text-gray-500">No data to preview</div>;

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((project: any, index: number) => (
            <Card key={index} className="h-full">
              <CardHeader className="pb-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{project.title}</h3>
                    {project.featured && (
                      <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  {project.subtitle && (
                    <p className="text-sm text-gray-600">{project.subtitle}</p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {project.description && (
                    <p className="text-gray-700 text-sm line-clamp-3">{project.description}</p>
                  )}
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech: string, techIndex: number) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {project.startDate && (
                      <span>{project.startDate}</span>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                      >
                        <span>View Project</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderSkillsPreview = () => {
    if (!data || !Array.isArray(data)) return <div className="text-gray-500">No data to preview</div>;

    // Group skills by category
    const skillsByCategory = data.reduce((acc: any, skill: any) => {
      const category = skill.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, skills]: [string, any]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 capitalize">{category}</h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{skill.name}</h4>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {skill.proficiency}
                          </Badge>
                        </div>
                        {skill.description && (
                          <p className="text-sm text-gray-600">{skill.description}</p>
                        )}
                        {skill.yearsOfExperience && (
                          <p className="text-xs text-gray-500">
                            {skill.yearsOfExperience} year{skill.yearsOfExperience !== 1 ? 's' : ''} of experience
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWritingPreview = () => {
    if (!data || !Array.isArray(data)) return <div className="text-gray-500">No data to preview</div>;

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Writing</h2>
        <div className="space-y-4">
          {data.map((article: any, index: number) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{article.title}</h3>
                      {article.subtitle && (
                        <p className="text-gray-600 mt-1">{article.subtitle}</p>
                      )}
                    </div>
                    {article.url && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 ml-4"
                      >
                        <span className="text-sm">Read</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  
                  {article.description && (
                    <p className="text-gray-700 text-sm">{article.description}</p>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {article.publishedDate && (
                      <span>{article.publishedDate}</span>
                    )}
                    {article.platform && (
                      <span>{article.platform}</span>
                    )}
                    {article.readTime && (
                      <span>{article.readTime} min read</span>
                    )}
                  </div>

                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag: string, tagIndex: number) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    switch (contentType) {
      case 'person':
        return renderPersonPreview();
      case 'experience':
        return renderExperiencePreview();
      case 'projects':
        return renderProjectsPreview();
      case 'skills':
        return renderSkillsPreview();
      case 'writing':
        return renderWritingPreview();
      default:
        return (
          <div className="text-gray-500">
            Preview not available for {contentType} content type
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-gray-600">
        {contentType === 'person' && <User className="h-5 w-5" />}
        {contentType === 'experience' && <Briefcase className="h-5 w-5" />}
        {contentType === 'projects' && <FolderOpen className="h-5 w-5" />}
        {contentType === 'skills' && <Code className="h-5 w-5" />}
        {contentType === 'writing' && <FileText className="h-5 w-5" />}
        <span className="font-medium capitalize">{contentType} Preview</span>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderPreview()}
      </div>
    </div>
  );
} 