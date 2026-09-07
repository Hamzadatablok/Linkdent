import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const API_URL = env.VITE_APP_BASE_NAME || '/';
  const PORT = 3000;

  return {
    root: __dirname,

    server: {
      open: true,
      port: PORT,
      host: true
    },

    preview: {
      open: true,
      host: true
    },

    build: {
      chunkSizeWarningLimit: 1600,
      outDir: 'dist',
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html')
      }
    },

    define: {
      global: 'window'
    },

    resolve: {
      alias: {
        App: path.resolve(__dirname, 'src/App.jsx'),

        serviceWorker: path.resolve(
          __dirname,
          'src/serviceWorker.jsx'
        ),

        reportWebVitals: path.resolve(
          __dirname,
          'src/reportWebVitals.js'
        ),

        config: path.resolve(
          __dirname,
          'src/config.js'
        ),

        views: path.resolve(__dirname, 'src/views'),
        store: path.resolve(__dirname, 'src/store'),
        'ui-component': path.resolve(__dirname, 'src/ui-component'),
        layout: path.resolve(__dirname, 'src/layout'),
        'menu-items': path.resolve(__dirname, 'src/menu-items'),
        routes: path.resolve(__dirname, 'src/routes'),
        themes: path.resolve(__dirname, 'src/themes'),
        contexts: path.resolve(__dirname, 'src/contexts'),
        hooks: path.resolve(__dirname, 'src/hooks'),
        api: path.resolve(__dirname, 'src/api'),
        assets: path.resolve(__dirname, 'src/assets'),
        utils: path.resolve(__dirname, 'src/utils'),

        '@tabler/icons-react':
          '@tabler/icons-react/dist/esm/icons/index.mjs'
      }
    },

    base: API_URL,

    plugins: [react()]
  };
});