import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import dts from 'vite-plugin-dts'
// import eslintPlugin from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts({
    outputDir: 'types',
    staticImport: true
  })],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'package/index'),
      name: 'x-vue-ace'
    },
    cssCodeSplit: true,
    sourcemap: true,
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
