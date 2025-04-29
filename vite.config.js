import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import * as sass from 'sass'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
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
})