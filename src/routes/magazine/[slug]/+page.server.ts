import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPublishedArticle, getPublishedArticles } from '$lib/server/cms';
import { listPublicArticleMedia } from '$lib/server/media';

export const load: PageServerLoad = async ({ params, platform }) => {
  const db = platform?.env?.DB;
  const article = await getPublishedArticle(db, params.slug);

  if (!article) {
    throw error(404, 'مقاله پیدا نشد.');
  }

  const articles = await getPublishedArticles(db);
  const media = article.id ? await listPublicArticleMedia(db, article.id) : [];
  const preferred = (article.relatedSlugs ?? [])
    .map((slug) => articles.find((item) => item.slug === slug))
    .filter((item): item is NonNullable<typeof item> => item !== undefined)
    .filter((item) => item.slug !== article.slug);

  const fallback = [
    ...articles.filter(
      (item) => item.slug !== article.slug && item.category === article.category
    ),
    ...articles.filter(
      (item) => item.slug !== article.slug && item.category !== article.category
    )
  ];

  const related = [...preferred, ...fallback]
    .filter((item, index, list) => list.findIndex((candidate) => candidate.slug === item.slug) === index)
    .slice(0, 3);

  return { article, related, media };
};
