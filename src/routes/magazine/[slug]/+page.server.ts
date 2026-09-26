import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPublishedArticle, getPublishedArticles } from '$lib/server/cms';

export const load: PageServerLoad = async ({ params, platform }) => {
  const db = platform?.env?.DB;
  const article = await getPublishedArticle(db, params.slug);

  if (!article) {
    throw error(404, 'مقاله پیدا نشد.');
  }

  const articles = await getPublishedArticles(db);
  const related = [
    ...articles.filter(
      (item) => item.slug !== article.slug && item.category === article.category
    ),
    ...articles.filter(
      (item) => item.slug !== article.slug && item.category !== article.category
    )
  ].slice(0, 3);

  return { article, related };
};
