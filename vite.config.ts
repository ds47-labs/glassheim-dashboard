import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { execSync } from 'child_process';

const buildVersion = process.env.BUILD_VERSION ?? (() => {
  try {
    return execSync('git describe --tags --always --dirty').toString().trim();
  } catch {
    return 'unknown';
  }
})();

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  define: {
    __BUILD_VERSION__: JSON.stringify(buildVersion),
  },
  server: {
    host: '0.0.0.0',
    hmr: { clientPort: 5173 }
  }
});
