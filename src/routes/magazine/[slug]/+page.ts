import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getMagazineArticle, getRelatedArticles } from '$lib/magazine';

export const load: PageLoad = ({ params }) => {
  const article = getMagazineArticle(params.slug);

  if (!article) {
    throw error(404, 'مقاله پیدا نشد.');
  }

  return {
    article,
    related: getRelatedArticles(article)
  };
};
