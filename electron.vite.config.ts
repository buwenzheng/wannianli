import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@main-core': resolve('src/main/core'),
        '@main-constants': resolve('src/main/constants'),
        '@main-features': resolve('src/main/features'),
        '@main-services': resolve('src/main/services'),
        '@main-utils': resolve('src/main/utils'),
        '@shared': resolve('src/shared'),
        '@resources': resolve('resources')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    resolve: {
      alias: {
        '@preload': resolve('src/preload'),
        '@preload-api': resolve('src/preload/api'),
        '@preload-utils': resolve('src/preload/utils'),
        '@main': resolve('src/main'),
        '@main-core': resolve('src/main/core'),
        '@main-constants': resolve('src/main/constants'),
        '@shared': resolve('src/shared'),
        '@resources': resolve('resources')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@components': resolve('src/renderer/src/components'),
        '@features': resolve('src/renderer/src/features'),
        '@utils': resolve('src/renderer/src/utils'),
        '@types': resolve('src/renderer/src/types'),
        '@stores': resolve('src/renderer/src/stores'),
        '@hooks': resolve('src/renderer/src/hooks'),
        '@layouts': resolve('src/renderer/src/layouts'),
        '@pages': resolve('src/renderer/src/pages'),
        '@shared': resolve('src/shared')
      }
    },
    plugins: [react()]
  }
})
