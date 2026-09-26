import type { PageServerLoad } from './$types';
import { getPublishedArticles } from '$lib/server/cms';

export const load: PageServerLoad = async ({ platform }) => {
  const articles = await getPublishedArticles(platform?.env?.DB);
  return { articles };
};
