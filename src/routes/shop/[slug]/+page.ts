import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getShopProduct } from '$lib/shopCatalog';

export const load: PageLoad = ({ params }) => {
  const product = getShopProduct(params.slug);
  if (!product) throw error(404, 'این شخصیت قهوه پیدا نشد.');
  return { product };
};
