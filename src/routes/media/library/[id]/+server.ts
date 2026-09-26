import type { RequestHandler } from './$types';
import { getMediaAsset } from '$lib/server/media';

export const GET: RequestHandler = async ({ params, platform, fetch }) => {
  const db = platform?.env?.DB;
  if (!db) return new Response('Media unavailable', { status: 503 });

  const asset = await getMediaAsset(db, params.id);
  if (!asset) return new Response('Not found', { status: 404 });

  if (asset.source === 'external') {
    if (!asset.url) return new Response('Not found', { status: 404 });

    const upstream = await fetch(asset.url, {
      headers: {
        'Accept': asset.media_type === 'video' ? 'video/*,*/*;q=0.8' : 'image/avif,image/webp,image/*,*/*;q=0.8',
        'User-Agent': 'EL.SEED/1.0'
      }
    });

    if (!upstream.ok || !upstream.body) {
      return new Response('Media unavailable', { status: 502 });
    }

    const headers = new Headers();
    headers.set(
      'Content-Type',
      upstream.headers.get('content-type') ||
        asset.mime_type ||
        (asset.media_type === 'video' ? 'video/mp4' : 'image/jpeg')
    );
    headers.set('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000');
    const length = upstream.headers.get('content-length');
    if (length) headers.set('Content-Length', length);
    const range = upstream.headers.get('accept-ranges');
    if (range) headers.set('Accept-Ranges', range);

    return new Response(upstream.body, { status: 200, headers });
  }

  const bucket = platform?.env?.MEDIA;
  if (!bucket || !asset.object_key) {
    return new Response('Media storage unavailable', { status: 503 });
  }

  const object = await bucket.get(asset.object_key);
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  headers.set(
    'Content-Type',
    object.httpMetadata?.contentType ||
      asset.mime_type ||
      (asset.media_type === 'video' ? 'video/mp4' : 'image/jpeg')
  );
  headers.set('Cache-Control', object.httpMetadata?.cacheControl || 'public, max-age=31536000, immutable');
  if (object.size) headers.set('Content-Length', String(object.size));
  if (asset.media_type === 'video') headers.set('Accept-Ranges', 'bytes');

  return new Response(object.body, { status: 200, headers });
};
