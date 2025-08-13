import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export const alt = 'Zishan Jawed - Backend Engineer & Fintech Specialist';
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
          {/* Name */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 16px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            Zishan Jawed
          </h1>
          
          {/* Title */}
          <h2
            style={{
              fontSize: '32px',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.9)',
              margin: '0 0 24px 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Backend Engineer & Fintech Specialist
          </h2>
          
          {/* Description */}
          <p
            style={{
              fontSize: '20px',
              color: 'rgba(255,255,255,0.8)',
              margin: '0 0 32px 0',
              maxWidth: '800px',
              lineHeight: '1.5',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            Building scalable, high-performance systems for fintech and ecommerce companies
          </p>
          
          {/* Tech stack */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['Node.js', 'Python', 'AWS', 'PostgreSQL', 'Redis', 'Docker'].map((tech) => (
              <span
                key={tech}
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
                {tech}
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