import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: ['remarkable-katex']
  },
  build: {
    commonjsOptions: {
      include: /node_modules|remarkable-katex/
    }
  }
})