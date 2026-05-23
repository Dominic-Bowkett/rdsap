import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so built asset URLs work whether the site is served from the
// repo sub-path (https://<user>.github.io/rdsap/) or any other path. The app
// has no client-side routing, so relative paths are safe.
export default defineConfig({
  base: './',
  plugins: [react()],
});
