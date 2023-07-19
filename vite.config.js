import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    minify: true,
    lib: {
      formats: ['es'],
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'wored',
      fileName: 'wored',
    },
  },
  plugins: [
    dts(),
  ],
})
