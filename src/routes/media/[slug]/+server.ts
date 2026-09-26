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
  'time-night': 'https://miro.medium.com/v2/resize%3Afit%3A1600/1%2AzROom6uk75DKb2ybNEzp4w.jpeg',
  'effect-strong': 'https://unsplash.com/photos/3b1mi9obsgA/download?force=true&w=1400',
  'effect-balanced': 'https://unsplash.com/photos/wlrmQa7Hli8/download?force=true&w=1400',
  'effect-many': 'https://unsplash.com/photos/t16HUOz9fjI/download?force=true&w=1400',
  'effect-taste': 'https://unsplash.com/photos/d7Mfj44MWWY/download?force=true&w=1400',
  'sensitivity-none': 'https://unsplash.com/photos/jsExhShuhW0/download?force=true&w=1400',
  'sensitivity-some': 'https://unsplash.com/photos/bu5LEzvtAKY/download?force=true&w=1400',
  'sensitivity-high': 'https://unsplash.com/photos/R1c8MDVkSzM/download?force=true&w=1400',
  'sensitivity-sleep': 'https://unsplash.com/photos/0qFoQqoBMSE/download?force=true&w=1400',
  'brew-espresso': 'https://unsplash.com/photos/4CPqHqOJaC4/download?force=true&w=1400',
  'brew-moka': 'https://unsplash.com/photos/SeOeOnhlehM/download?force=true&w=1400',
  'brew-v60': 'https://unsplash.com/photos/Na9Nf29-tYU/download?force=true&w=1400',
  'brew-french': 'https://unsplash.com/photos/wjTVOq5JTIU/download?force=true&w=1400',
  'brew-filter': 'https://unsplash.com/photos/4SbIieFtx74/download?force=true&w=1400',
  'brew-unsure': 'https://unsplash.com/photos/mgvCv7Ht5hw/download?force=true&w=1400',
  'time-morning-human-v2': 'https://images.pexels.com/photos/18287651/pexels-photo-18287651.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'effect-strong-human-v2': 'https://images.pexels.com/photos/15356224/pexels-photo-15356224.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'effect-balanced-human-v2': 'https://images.pexels.com/photos/3184647/pexels-photo-3184647.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'effect-many-human-v2': 'https://images.pexels.com/photos/1595390/pexels-photo-1595390.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'effect-taste-human-v2': 'https://images.pexels.com/photos/19332203/pexels-photo-19332203.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'sensitivity-none-human-v2': 'https://images.pexels.com/photos/7580957/pexels-photo-7580957.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'sensitivity-some-human-v2': 'https://images.pexels.com/photos/20955029/pexels-photo-20955029.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'sensitivity-high-human-v2': 'https://images.pexels.com/photos/12182488/pexels-photo-12182488.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'sensitivity-sleep-human-v2': 'https://images.pexels.com/photos/36713413/pexels-photo-36713413.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'brew-espresso-human-v2': 'https://images.pexels.com/photos/302898/pexels-photo-302898.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'brew-moka-human-v2': 'https://images.pexels.com/photos/7243725/pexels-photo-7243725.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'brew-v60-human-v2': 'https://images.pexels.com/photos/15138582/pexels-photo-15138582.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'brew-french-human-v2': 'https://images.pexels.com/photos/7488694/pexels-photo-7488694.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'brew-filter-human-v2': 'https://images.pexels.com/photos/8937266/pexels-photo-8937266.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'brew-unsure-human-v2': 'https://images.pexels.com/photos/15909946/pexels-photo-15909946.jpeg?auto=compress&cs=tinysrgb&w=1400'
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
  if (params.slug === 'time-day' || params.slug === 'time-day-v2') {
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
