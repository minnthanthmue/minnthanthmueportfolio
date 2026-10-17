import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

function imageUploadPlugin(): Plugin {
  return {
    name: 'image-upload-handler',
    configureServer(server) {
      server.middlewares.use('/api/upload', (req, res) => {
        if (req.method === 'POST') {
          const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
          const type = url.searchParams.get('type') || 'profile';
          const chunks: Buffer[] = [];
          req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          req.on('end', () => {
            try {
              const buffer = Buffer.concat(chunks);
              let targetPath = '';
              if (type === 'profile') {
                targetPath = path.resolve(process.cwd(), 'public/assets/profile.png');
              } else if (type === 'certificate') {
                targetPath = path.resolve(process.cwd(), 'public/assets/certificates/google-ai-cert.png');
              }
              if (targetPath) {
                fs.mkdirSync(path.dirname(targetPath), { recursive: true });
                fs.writeFileSync(targetPath, buffer);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, path: targetPath }));
                return;
              }
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Unknown upload type' }));
            } catch (err: unknown) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }));
            }
          });
        } else {
          res.writeHead(405).end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), imageUploadPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
