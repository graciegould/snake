import { defineConfig } from 'vite';

const config = defineConfig({
  server: {
    port: 4000,
    hmr: {
      overlay: true, 
    },
  }
});

export default config;