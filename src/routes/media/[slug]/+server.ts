import type { RequestHandler } from './$types';
import afternoon0 from '$lib/assets/time-afternoon/part0.b64?raw';
import afternoon1 from '$lib/assets/time-afternoon/part1.b64?raw';
import afternoon2 from '$lib/assets/time-afternoon/part2.b64?raw';
import afternoon3 from '$lib/assets/time-afternoon/part3.b64?raw';
import afternoon4 from '$lib/assets/time-afternoon/part4.b64?raw';
import day0 from '$lib/assets/time-day/part0.b64?raw';
import day1 from '$lib/assets/time-day/part1.b64?raw';

const afternoonImageBase64 = [
  afternoon0,
  afternoon1,
  afternoon2,
  afternoon3,
  afternoon4
].join('');

const dayImageBase64 = [day0, day1].join('');

const images: Record<string, string> = {
  hero: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=88',
  find: 'https://images.unsplash.com/photo-1770055592659-b35f56ea6b45?auto=format&fit=crop&fm=jpg&q=88&w=1600',
  fix: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=84',
  me: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=84',
  philosophy: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=86',
  espresso: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=82',
  caffeine: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=1000&q=82',
  v60: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1000&q=82',
  'flavor-chocolate': 'https://images.unsplash.com/photo-1728310335347-082140001938?auto=format&fit=crop&w=900&h=900&q=86',
  'flavor-caramel': 'https://images.unsplash.com/photo-1575127749163-96a305397d19?auto=format&fit=crop&w=900&h=900&q=86',
  'flavor-fruity': 'https://images.unsplash.com/photo-1645539824153-fb1eb030dcd8?auto=format&fit=crop&w=900&h=900&q=86',
  'flavor-bold': 'https://images.unsplash.com/photo-1774841533608-28afd963a9c6?auto=format&fit=crop&w=900&h=900&q=86',
  'flavor-unsure': 'https://images.unsplash.com/photo-1564676677001-92e8f1a0df30?auto=format&fit=crop&w=900&h=900&q=86',
  'time-morning': 'https://images.pexels.com/photos/16003598/pexels-photo-16003598.jpeg?cs=srgb&fm=jpg&w=1600',
  'time-afternoon': 'https://images.unsplash.com/photo-1739423709394-db7a52c8ff40?auto=format&fit=crop&fm=jpg&q=88&w=1800',
  'time-afternoon-v2': 'https://unsplash.com/photos/_jJlPYxZzoA/download?force=true&w=1800',
  'time-afternoon-v3': 'https://images.pexels.com/photos/4921513/pexels-photo-4921513.jpeg?cs=srgb&fm=jpg&w=1800',
  'time-night': 'https://miro.medium.com/v2/resize%3Afit%3A1600/1%2AzROom6uk75DKb2ybNEzp4w.jpeg'
};

function imageResponse(base64: string) {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new Response(bytes, {
    status: 200,
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}

export const GET: RequestHandler = async ({ params, fetch }) => {
  if (params.slug === 'time-day') {
    return imageResponse(dayImageBase64);
  }

  if (params.slug === 'time-afternoon-v4') {
    return imageResponse(afternoonImageBase64);
  }

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
