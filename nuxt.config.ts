import process from 'node:process'
import dsv from '@rollup/plugin-dsv'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { appDescription, proxyBaseURL } from './constants'
import { pwa } from './config/pwa'

export default defineNuxtConfig({
  modules: [
    '@vant/nuxt',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
    'nuxt-monaco-editor',
  ],

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  css: [
    '@unocss/reset/tailwind-compat.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: [],
    },
  },

  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },

  pwa,

  devtools: {
    enabled: true,
  },

  vue: {
    compilerOptions: {
      isCustomElement: tag => ['Script'].includes(tag),
    },
  },

  routeRules: {
    '/api/**': {
      proxy: `${proxyBaseURL}/api/**`,
    },
  },

  build: {
    transpile:
        process.env.NODE_ENV === 'production'
          ? [
              'naive-ui',
              'vueuc',
              '@css-render/vue3-ssr',
              '@juggle/resize-observer',
            ]
          : ['@juggle/resize-observer'],
  },

  vite: {
    optimizeDeps: {
      include:
          process.env.NODE_ENV === 'development'
            ? ['naive-ui', 'vueuc', 'date-fns-tz/formatInTimeZone']
            : [],
    },
    plugins: [
      Components({
        dts: true,
        resolvers: [NaiveUiResolver()], // Automatically register all components in the `components` directory
      }),
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      dsv(),
    ],
  },
})
