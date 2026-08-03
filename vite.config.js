import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // The entry is kept below a stricter 180 KiB gzip budget by
    // scripts/validate-bundle.js. This raw-size threshold avoids a noisy
    // warning for a well-compressed 539 KiB bundle.
    chunkSizeWarningLimit: 600
  }
})
