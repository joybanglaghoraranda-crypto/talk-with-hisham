import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = 'https://twhisham.vercel.app';
  const atomXml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Talk with Hisham</title>
  <subtitle>Reflections and Conversations by Muhibbullah Hisham</subtitle>
  <link href="${siteUrl}/feed.xml" rel="self"/>
  <link href="${siteUrl}"/>
  <updated>${new Date().toISOString()}</updated>
  <id>${siteUrl}/</id>
  <author>
    <name>Muhibbullah Hisham</name>
    <email>ibnenurakondo@gmail.com</email>
  </author>

  <entry>
    <title>Bridging Classical Scholarship with Modern Thought</title>
    <link href="${siteUrl}/about"/>
    <id>${siteUrl}/about</id>
    <updated>${new Date().toISOString()}</updated>
    <summary>Exploring intersections of classical madrasa education, curriculum development, and youth mentorship.</summary>
  </entry>
</feed>`;

  return new NextResponse(atomXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
