import { defineConfig } from 'vite'

export default defineConfig({
  // https://keqingrong.cn/blog/2021-11-24-commonjs-compatibility-with-vite/
  optimizeDeps: {
    include: ['remarkable-katex']
  },
  build: {
    commonjsOptions: {
      include: /node_modules|remarkable-katex/
    }
  }
})
