import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import * as sass from 'sass'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  base: './', // Set base path for assets
  build: {
    outDir: 'dist/build/h5',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-i18n'],
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, // 禁用弃用警告
        implementation: sass,
        sassOptions: {
          outputStyle: 'expanded',
          quietDeps: true
        }
      },
    },
  },
  // server: {
  //   port: 3000,
  //   host: true
  // },
  server: {
    host: "localhost",
    port: 3000,
  }
})
