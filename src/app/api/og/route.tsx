import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Talk with Hisham';
    const subtitle = searchParams.get('subtitle') || 'Educator · Researcher · Mentor';
    const tag = searchParams.get('tag') || 'Islamic Scholarship & Modern Thought';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0a0a0a',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #161b16 2%, transparent 0%), radial-gradient(circle at 75px 75px, #161b16 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '60px 80px',
            fontFamily: 'sans-serif',
            color: 'white',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}
              >
                TWH
              </div>
              <span style={{ fontSize: '26px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
                Talk with Hisham
              </span>
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#f97316',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                padding: '6px 16px',
                borderRadius: '20px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              {tag}
            </div>
          </div>

          {/* Main Title Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' }}>
            <div
              style={{
                fontSize: '56px',
                fontWeight: '900',
                lineHeight: 1.15,
                color: '#ffffff',
                letterSpacing: '-1.5px',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '24px',
                color: 'rgba(255, 255, 255, 0.65)',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Footer Area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '18px', color: '#f97316', fontWeight: '600' }}>
                Muhibbullah Hisham
              </div>
              <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
              <div style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.5)' }}>
                twhisham.vercel.app
              </div>
            </div>
            <div style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.4)' }}>
              Real-time Discourse & Reflections
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
