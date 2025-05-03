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
  },/*
	server:{
		port:3000,
		host:'0.0.0.0',
		open:true
	}*/
	// vue.config.js
  server: {
    host: '0.0.0.0',
    port: 30099
  }
})
