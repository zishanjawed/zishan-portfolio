export function PersonStructuredData() {
  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Zishan Jawed',
    url: 'https://zishanjawed.com',
    jobTitle: 'Backend Engineer',
    description: 'Backend engineer specializing in fintech, payment systems, and scalable architecture. Expert in Node.js, Python, and cloud technologies with experience building high-performance systems.',
    image: 'https://zishanjawed.com/og-image.png',
    sameAs: [
      'https://github.com/zishanjawed',
      'https://linkedin.com/in/zishanjawed',
      'https://twitter.com/zishanjawed'
    ],
    knowsAbout: [
      'Backend Engineering',
      'Fintech',
      'Payment Systems',
      'Microservices',
      'Node.js',
      'Python',
      'AWS',
      'PostgreSQL',
      'Redis',
      'Docker',
      'Kubernetes',
      'Scalable Architecture',
      'Cloud Computing',
      'API Design',
      'Database Design',
      'System Architecture'
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Backend Engineer',
      description: 'Designing and implementing scalable backend systems for fintech and ecommerce applications'
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance/Consultant',
      description: 'Independent backend engineering consultant'
    },
    alumniOf: {
      '@type': 'Organization',
      name: 'Various Fintech and Ecommerce Companies'
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: 'India'
    },
    knowsLanguage: [
      {
        '@type': 'Language',
        name: 'English',
        proficiencyLevel: 'Native'
      },
      {
        '@type': 'Language',
        name: 'Hindi',
        proficiencyLevel: 'Native'
      }
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Professional Experience',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Fintech Industry'
        }
      }
    ]
  };

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zishan Jawed',
    url: 'https://zishanjawed.com',
    logo: 'https://zishanjawed.com/logo.png',
    description: 'Backend engineering services specializing in fintech, payment systems, and scalable architecture',
    founder: {
      '@type': 'Person',
      name: 'Zishan Jawed',
      jobTitle: 'Backend Engineer',
      description: 'Experienced backend engineer specializing in fintech, scalable architecture, and microservices.',
      url: 'https://zishanjawed.com'
    },
    serviceType: [
      'Backend Development',
      'Fintech Solutions',
      'Payment System Architecture',
      'Microservices Design',
      'Cloud Architecture',
      'API Development',
      'Database Design',
      'System Optimization'
    ],
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Backend Engineering Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Backend Development',
            description: 'Custom backend development for web and mobile applications'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Fintech Solutions',
            description: 'Payment processing platforms and financial API development'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'System Architecture',
            description: 'Scalable system design and microservices architecture'
          }
        }
      ]
    }
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Zishan Jawed - Backend Engineer & Fintech Specialist',
    url: 'https://zishanjawed.com',
    description: 'Portfolio website showcasing backend engineering projects, case studies, and technical writing',
    author: {
      '@type': 'Person',
      name: 'Zishan Jawed',
      url: 'https://zishanjawed.com'
    },
    publisher: {
      '@type': 'Person',
      name: 'Zishan Jawed',
      url: 'https://zishanjawed.com'
    },
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    mainEntity: {
      '@type': 'Person',
      name: 'Zishan Jawed',
      jobTitle: 'Backend Engineer',
      description: 'Backend engineer specializing in fintech, payment systems, and scalable architecture.'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personData)
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
          __html: JSON.stringify(websiteData)
        }}
      />
    </>
  );
} 