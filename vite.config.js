import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [createVuePlugin()],
  optimizeDeps: {
    include: ['babel-polyfill', 'es6-promise', 'js-md5', 'mescroll.js', 'axios', 'mescroll.js', 'recorder-core', 'lrz', 'vue-cropper']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.vue', '.json', '.ts']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/variables.scss";`
      }
    }
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 9092,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  build: {
    // Tauri expects a fixed port, fail if that port is not available
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  define: {
    // Define environment variables for the client
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    // Define global MeScroll variable to avoid assignment errors
    'global.MeScroll': 'null',
    'process.env.VUE_APP_CLIENT_SOCKET': JSON.stringify(process.env.VUE_APP_CLIENT_SOCKET || 'http://107.174.137.176:85'),
    'process.env.VUE_APP_CLIENT_API': JSON.stringify(process.env.VUE_APP_CLIENT_API || 'http://107.174.137.176:5000'),
    'process.env.VUE_APP_PUBLIC_KEY': JSON.stringify(process.env.VUE_APP_PUBLIC_KEY || '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDOaQO5ImLVJwdyDYx4c/QdOKbgB0bV5k/4n9UQej0RhegR8PAfy9bSTagR/2hxSsE5vaE4YjYGtSmFrsWfoUyQHbcJGIfSUUYkcE2OMq4mmENk5KbrUemWdFEIp0k/Y7DlPMAGUdt2YeRakY1gzUI9kyZOcuA0ZP6vzwe8wnFtMwIDAQAB-----END PUBLIC KEY-----'),
    'process.env.PATH_INDEX_PIC': JSON.stringify(process.env.PATH_INDEX_PIC || 'http://107.174.137.176:85'),
    // 同时定义 import.meta.env 变量
    'import.meta.env.VUE_APP_CLIENT_SOCKET': JSON.stringify(process.env.VUE_APP_CLIENT_SOCKET || 'http://107.174.137.176:85'),
    'import.meta.env.VUE_APP_CLIENT_API': JSON.stringify(process.env.VUE_APP_CLIENT_API || 'http://107.174.137.176:5000'),
    'import.meta.env.VUE_APP_PUBLIC_KEY': JSON.stringify(process.env.VUE_APP_PUBLIC_KEY || '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDOaQO5ImLVJwdyDYx4c/QdOKbgB0bV5k/4n9UQej0RhegR8PAfy9bSTagR/2hxSsE5vaE4YjYGtSmFrsWfoUyQHbcJGIfSUUYkcE2OMq4mmENk5KbrUemWdFEIp0k/Y7DlPMAGUdt2YeRakY1gzUI9kyZOcuA0ZP6vzwe8wnFtMwIDAQAB-----END PUBLIC KEY-----'),
    'import.meta.env.PATH_INDEX_PIC': JSON.stringify(process.env.PATH_INDEX_PIC || 'http://107.174.137.176:85'),
  },
})