import { defineConfig } from 'vite';

// Config mínima, igual em espírito ao Projeto-Baluarte: JS puro + Vite, sem
// plugins. `base: './'` deixa o build em dist/ funcionar tanto na raiz de um
// domínio quanto embutido numa subpasta (ex.: dentro da plataforma Baluarte).
export default defineConfig({
  base: './',
  server: { host: true },
  build: { outDir: 'dist', target: 'es2022' },
});
