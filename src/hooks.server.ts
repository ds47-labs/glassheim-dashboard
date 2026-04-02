import type { Handle } from '@sveltejs/kit';

const config = JSON.stringify({
  PUBLIC_HA_URL: process.env.PUBLIC_HA_URL ?? '',
  PUBLIC_HA_TOKEN: process.env.PUBLIC_HA_TOKEN ?? ''
});

const inlineScript = `<script>window.__config__ = ${config};</script>`;

export const handle: Handle = async ({ event, resolve }) => {
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('</head>', `${inlineScript}</head>`)
  });
};
