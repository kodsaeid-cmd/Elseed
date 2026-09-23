import type { RequestHandler } from './$types';

const images: Record<string, string> = {
  hero: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=88',
  find: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=84',
  fix: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=84',
  me: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=84',
  philosophy: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=86',
  espresso: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=82',
  caffeine: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=1000&q=82',
  v60: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1000&q=82'
};

export const GET: RequestHandler = async ({ params, fetch }) => {
  const source = images[params.slug];
  if (!source) {
    return new Response('Not found', { status: 404 });
  }

  const upstream = await fetch(source, {
    headers: {
      'Accept': 'image/avif,image/webp,image/*,*/*;q=0.8',
      'User-Agent': 'EL.SEED/1.0'
    }
  });

  if (!upstream.ok || !upstream.body) {
    return new Response('Image unavailable', { status: 502 });
  }

  const headers = new Headers();
  headers.set('Content-Type', upstream.headers.get('content-type') ?? 'image/jpeg');
  headers.set('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000');

  return new Response(upstream.body, { status: 200, headers });
};
