import { ProjectsPageData } from '../../schemas/projects';

interface ProjectStructuredDataProps {
  data: ProjectsPageData;
}

export function ProjectStructuredData({ data }: ProjectStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data.title,
    description: data.description,
    numberOfItems: data.projects.length,
    itemListElement: data.projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        '@id': `https://zishanjawed.com/projects#${project.id}`,
        name: project.title,
        description: project.description,
        url: `https://zishanjawed.com/projects#${project.id}`,
        author: {
          '@type': 'Person',
          name: 'Zishan Jawed',
          url: 'https://zishanjawed.com'
        },
        dateCreated: project.startDate,
        dateModified: project.endDate || project.startDate,
        genre: project.category,
        audience: {
          '@type': 'Audience',
          audienceType: 'Developers and Technology Professionals'
        },
        ...(project.thumbnail && {
          image: {
            '@type': 'ImageObject',
            url: project.thumbnail,
            caption: project.title
          }
        }),
        ...(project.metrics && {
          interactionStatistic: [
            ...(project.metrics.users ? [{
              '@type': 'InteractionCounter',
              interactionType: 'https://schema.org/UserInteraction',
              userInteractionCount: project.metrics.users
            }] : []),
            ...(project.metrics.transactions ? [{
              '@type': 'InteractionCounter',
              interactionType: 'https://schema.org/UserInteraction',
              userInteractionCount: project.metrics.transactions
            }] : [])
          ]
        }),
        ...(project.technologies && {
          about: project.technologies.map(tech => ({
            '@type': 'Thing',
            name: tech.name,
            description: `${tech.category} technology`
          }))
        })
      }
    }))
  };

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zishan Jawed',
    url: 'https://zishanjawed.com',
    logo: 'https://zishanjawed.com/logo.png',
    sameAs: [
      'https://github.com/zishanjawed',
      'https://linkedin.com/in/zishanjawed',
      'https://twitter.com/zishanjawed'
    ],
    founder: {
      '@type': 'Person',
      name: 'Zishan Jawed',
      jobTitle: 'Backend Engineer',
      description: 'Experienced backend engineer specializing in fintech, scalable architecture, and microservices.',
      url: 'https://zishanjawed.com'
    }
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://zishanjawed.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Projects',
        item: 'https://zishanjawed.com/projects'
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
    </>
  );
} 