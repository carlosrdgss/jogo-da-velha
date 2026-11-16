import { defineConfig } from 'vite';

// base './' (caminhos relativos): o mesmo build pode ser publicado em
// /<repositorio>/staging/ e em /<repositorio>/ sem recompilar.
export default defineConfig({
  base: './',
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: ['src/main.js'],
      thresholds: { lines: 60 },
    },
  },
});
