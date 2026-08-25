import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/ratelimit';

// System knowledge base for Muhibbullah Hisham
const KNOWLEDGE_BASE = {
  name: 'Muhibbullah Hisham',
  roles: ['Educator', 'Assistant Researcher', 'Instructor', 'Youth Mentor'],
  background:
    'Muhibbullah Hisham was born in Mymensingh, Bangladesh, and raised in Jamalpur and Dhaka. He memorized the Holy Quran at an Alia madrasa and completed his Dawra-e-Hadith (Master’s Equivalent) in Dhaka. He also pursued a Post Graduate Diploma (PGD) in Islamic Dawah from As-Sunnah Dawah & Research Institute.',
  interests: [
    'Integrating classical Islamic scholarship with modern thought and sciences',
    'Education research and curriculum innovation',
    'African studies and linguistic development',
    'Youth mentorship, character building, and social development',
  ],
  mission:
    'Bridging traditional Islamic heritage with contemporary intellectual discourse, empowering students and communities through education, ethical dialogue, and purposeful living.',
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    
    // Rate limit: 15 AI requests per minute per IP
    const rateLimit = await checkRateLimit(`ai_${ip}`, 15, 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before asking another question.' },
        { status: 429 }
      );
    }

    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const trimmed = message.trim().toLowerCase();

    // Check if Gemini API key exists
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `You are the friendly AI Discourse Assistant on the official website of Muhibbullah Hisham ("Talk with Hisham").
Context about Hisham:
- Background: ${KNOWLEDGE_BASE.background}
- Roles: ${KNOWLEDGE_BASE.roles.join(', ')}
- Core Mission: ${KNOWLEDGE_BASE.mission}
- Focus Areas: ${KNOWLEDGE_BASE.interests.join('; ')}

Instructions:
- Provide polite, intellectual, and thoughtful answers in English or Bengali depending on the user's language.
- When asked about Hisham, his studies, or website features, answer accurately using the context.
- When asked general questions about Islamic thought, education, or philosophy, provide balanced and well-reasoned answers.
- Keep responses concise (under 2-3 paragraphs) and engaging.

User query: ${message}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Thank you for your message. How else can I assist your exploration?';
          return NextResponse.json({ reply });
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to local engine:', geminiErr);
      }
    }

    // Built-in Knowledge Base Engine (100% Free Fallback)
    let reply = '';
    if (trimmed.includes('who is') || trimmed.includes('about hisham') || trimmed.includes('hisham') || trimmed.includes('পরিচয়') || trimmed.includes('কে')) {
      reply = `${KNOWLEDGE_BASE.name} is an ${KNOWLEDGE_BASE.roles.join(', ')} dedicated to ${KNOWLEDGE_BASE.mission} He holds degrees in classical Islamic studies (Dawra-e-Hadith, PGD from As-Sunnah) and focuses on education research, languages, and youth mentorship.`;
    } else if (trimmed.includes('education') || trimmed.includes('study') || trimmed.includes('madrasa') || trimmed.includes('পড়াশোনা') || trimmed.includes('শিক্ষা')) {
      reply = `Hisham’s academic journey includes memorizing the Qur’an (Alia madrasa), Dawra-e-Hadith (Master's Equivalent from Dhaka), and a Post Graduate Diploma in Islamic Dawah from As-Sunnah Dawah & Research Institute. He is currently focused on curriculum development and African studies.`;
    } else if (trimmed.includes('contact') || trimmed.includes('email') || trimmed.includes('message') || trimmed.includes('যোগাযোগ')) {
      reply = `You can get in touch with Muhibbullah Hisham directly via email at ibnenurakondo@gmail.com, via Telegram (@twhisham), or through the Inbox and Chat features on this website.`;
    } else if (trimmed.includes('chat') || trimmed.includes('feed') || trimmed.includes('talk with hisham') || trimmed.includes('website')) {
      reply = `"Talk with Hisham" is a personal platform designed for real-time intellectual discourse, community discussions, sharing articles, and connecting with learners and thinkers.`;
    } else {
      reply = `Peace be upon you! I am the AI Assistant for "Talk with Hisham". Muhibbullah Hisham's work centers on bridging classical Islamic scholarship with modern education, research, and youth mentorship. Feel free to ask about his background, publications, or discussion topics!`;
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
