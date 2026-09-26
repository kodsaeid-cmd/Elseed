import type { RequestHandler } from './$types';
import { getPublishedArticles } from '$lib/server/cms';

const origin = 'https://elseed.ir';

export const GET: RequestHandler = async ({ platform }) => {
  const magazineArticles = await getPublishedArticles(platform?.env?.DB);
  const staticPages = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/find', changefreq: 'monthly', priority: '0.9' },
    { path: '/fix', changefreq: 'monthly', priority: '0.9' },
    { path: '/coffee-and-me', changefreq: 'monthly', priority: '0.8' },
    { path: '/magazine', changefreq: 'daily', priority: '0.9' }
  ];

  const urls = [
    ...staticPages.map(
      (page) => `  <url>
    <loc>${origin}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    ),
    ...magazineArticles.map(
      (article) => `  <url>
    <loc>${origin}/magazine/${article.slug}</loc>
    <lastmod>${article.updatedIso ?? article.publishedIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
  ].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=21600'
    }
  });
};
