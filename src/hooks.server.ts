import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

export const handle: Handle = async ({ event, resolve }) => {
  const config = JSON.stringify({
    PUBLIC_HA_URL: env.PUBLIC_HA_URL ?? '',
    PUBLIC_HA_TOKEN: env.PUBLIC_HA_TOKEN ?? ''
  });

  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace('</head>', `<script>window.__config__ = ${config};</script></head>`)
  });
};
