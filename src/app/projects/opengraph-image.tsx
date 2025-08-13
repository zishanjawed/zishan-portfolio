import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export const alt = 'Projects & Case Studies - Zishan Jawed';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Page title */}
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 16px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            Projects & Case Studies
          </h1>
          
          {/* Subtitle */}
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.9)',
              margin: '0 0 24px 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Zishan Jawed
          </h2>
          
          {/* Description */}
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.8)',
              margin: '0 0 32px 0',
              maxWidth: '800px',
              lineHeight: '1.5',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            Explore portfolio projects and case studies in fintech, ecommerce, and scalable backend architecture
          </p>
          
          {/* Project categories */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['Fintech', 'Ecommerce', 'SaaS', 'Open Source'].map((category) => (
              <span
                key={category}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
        
        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
} 