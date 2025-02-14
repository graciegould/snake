import { defineConfig } from 'vite';

const config = defineConfig({
  server: {
    port: 3000,
    hmr: {
      overlay: true, 
    },
  }
});

export default config;