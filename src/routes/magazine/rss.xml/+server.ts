import type { RequestHandler } from './$types';
import { getPublishedArticles } from '$lib/server/cms';

const origin = 'https://elseed.ir';

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: RequestHandler = async ({ platform }) => {
  const magazineArticles = await getPublishedArticles(platform?.env?.DB);
  const items = magazineArticles
    .map(
      (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${origin}/magazine/${article.slug}</link>
      <guid isPermaLink="true">${origin}/magazine/${article.slug}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${new Date(article.publishedIso + 'T09:00:00Z').toUTCString()}</pubDate>
      <category>${escapeXml(article.category)}</category>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>مجله EL.SEED</title>
    <link>${origin}/magazine</link>
    <description>قهوه برای زندگی واقعی؛ انتخاب، طعم، دم‌آوری و حل مشکل فنجان.</description>
    <language>fa-ir</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=21600'
    }
  });
};
