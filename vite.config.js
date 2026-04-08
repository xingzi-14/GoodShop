import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve :{
    alias : {
       "@" : path.resolve(__dirname, "src")
    }
  },
  //启动跨域处理
  server:{
    proxy : {
      //将第三方域名别名化处理
      '/api' : {
        target :'http://api.jjcto.com/',
        changeOrigin : true,
        rewrite :(path) => path.replace(/^\/api/,'')
      }
    }
  }
})
