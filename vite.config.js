import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        'login': fileURLToPath(new URL('./login.html', import.meta.url)),
        'login-pegawai': fileURLToPath(new URL('./login-pegawai.html', import.meta.url)),
        'login-admin': fileURLToPath(new URL('./login-admin.html', import.meta.url)),
        'pegawai': fileURLToPath(new URL('./pegawai.html', import.meta.url)),
        'admin': fileURLToPath(new URL('./admin.html', import.meta.url)),
      },
    },
  },
});
