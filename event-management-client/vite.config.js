import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default {
  server: {
    proxy: {
      '/api': 'http://192.168.29.51:5000', 
    },
  },
};
