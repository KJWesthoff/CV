import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Stuff for the Vite svg loader
import svgLoader from  'vite-svg-loader'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader()
  ],
  base:'/CV/',
  server: {
    port:8080,
  }
})
