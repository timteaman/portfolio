import vituum from 'vituum';
import posthtml from '@vituum/vite-plugin-posthtml';
import postcss from '@vituum/vite-plugin-postcss';
import { copyFileSync } from 'fs';

export default {
  server: {
    host: true,
    port: 5173,
  },
  plugins: [
    vituum(),
    postcss(),
    posthtml({
      root: './src',
    }),
    {
      name: 'custom-hmr',
      enforce: 'post',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.html')) {
          server.ws.send({
            type: 'full-reload',
            path: '*',
          });
        }
      },
    },
    {
      name: 'copy-static-files',
      writeBundle() {
        copyFileSync(
          'src/assets/favicon/favicon-32x32.png',
          'dist/favicon-32x32.png'
        );
        copyFileSync(
          'src/assets/favicon/favicon-16x16.png',
          'dist/favicon-16x16.png'
        );
        copyFileSync(
          'src/assets/favicon/apple-touch-icon.png',
          'dist/apple-touch-icon.png'
        );
        copyFileSync(
          'src/assets/favicon/android-chrome-192x192.png',
          'dist/android-chrome-192x192.png'
        );
        copyFileSync(
          'src/assets/favicon/android-chrome-512x512.png',
          'dist/android-chrome-512x512.png'
        );
        copyFileSync(
          'src/assets/favicon/site.webmanifest',
          'dist/site.webmanifest'
        );
      },
    },
  ],

  build: {
    root: './src',
    sourcemap: true,
    rollupOptions: {
      output: {
        assetFileNames: (asset) => {
          const filePath = asset.name.split('/');
          const fileName = filePath.pop();
          const nestedPath = filePath.join('/');
          const outputPath = `${
            nestedPath ? nestedPath + '/' : ''
          }[name][extname]`;

          if (
            asset.name.includes('favicon') ||
            asset.name.includes('apple-touch-icon') ||
            asset.name.includes('android-chrome')
          ) {
            return `${outputPath}`;
          }

          if (asset.type === 'asset') {
            switch (asset.name.split('.').pop()) {
              case 'css':
                return `css/${outputPath}`;
              case 'png':
              case 'jpg':
              case 'webp':
              case 'svg':
                return `images/${outputPath}`;
              case 'woff2':
                return `fonts/${outputPath}`;
              case 'webmanifest':
                return `${outputPath}`;
              default:
                return `other/${outputPath}`;
            }
          }
        },
        preserveModuleDirectories: true,
      },
    },
  },
};
