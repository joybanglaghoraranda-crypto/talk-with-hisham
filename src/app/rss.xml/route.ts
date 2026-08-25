import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = 'https://twhisham.vercel.app';
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Talk with Hisham</title>
    <link>${siteUrl}</link>
    <description>Conversations, Opinions, and Intellectual Discourse by Muhibbullah Hisham</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    
    <item>
      <title>Bridging Classical Islamic Scholarship and Modern Thought</title>
      <link>${siteUrl}/about</link>
      <guid>${siteUrl}/about</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>Exploring intersections of classical madrasa education, curriculum innovation, and contemporary intellectual challenges.</description>
    </item>
    <item>
      <title>Community Feed &amp; Real-time Discussions</title>
      <link>${siteUrl}/feed</link>
      <guid>${siteUrl}/feed</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>Join the live community discussions and follow thought-provoking reflections on Talk with Hisham.</description>
    </item>
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
