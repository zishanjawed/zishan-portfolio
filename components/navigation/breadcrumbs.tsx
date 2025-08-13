import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `https://zishanjawed.com${item.href}` })
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="mx-2 h-4 w-4 text-slate-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {item.current ? (
                <span
                  className="font-medium text-slate-900 dark:text-white"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

// Predefined breadcrumb configurations
export const breadcrumbConfigs = {
  home: [{ label: 'Home', href: '/', current: true }],
  projects: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects', current: true }
  ],
  writing: [
    { label: 'Home', href: '/' },
    { label: 'Writing', href: '/writing', current: true }
  ],
  contact: [
    { label: 'Home', href: '/' },
    { label: 'Contact', href: '/contact', current: true }
  ],
  project: (projectTitle: string) => [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: projectTitle, current: true }
  ],
  article: (articleTitle: string) => [
    { label: 'Home', href: '/' },
    { label: 'Writing', href: '/writing' },
    { label: articleTitle, current: true }
  ]
}; 