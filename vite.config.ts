import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import * as sass from 'sass'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  define: {
    'import.meta.env.UNI_PLATFORM': JSON.stringify(process.env.UNI_PLATFORM || ''),
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
  server: {
    host: '0.0.0.0',
    port: 30099
  }
})
