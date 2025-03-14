import { config } from 'dotenv';
import { randomUUID } from 'node:crypto';
import { TG_WEB_APP_URI } from './app/constants/links';
// import { ym, ymNoScript } from './app/constants/metrics';


config();

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  ssr: false,

  app: {
    head: {
      title: 'CyberPay',
      script: [
        { src: TG_WEB_APP_URI },
        // { innerHTML: ym, type: 'text/javascript' },
      ],
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
        },
        {
          name: 'theme-color',
          content: '#100F10',
        },
        {
          'http-equiv': 'Permissions-Policy',
          content: 'interest-cohort=()',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/webp',
          href: '/icons/manifest/icon64.webp',
        },
        {
          rel: 'mask-icon',
          type: 'image/webp',
          href: '/icons/manifest/icon64.webp',
          color: '#100F10',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/webp',
          href: '/icons/manifest/icon64.webp',
        },
        {
          rel: 'manifest',
          crossorigin: 'use-credentials',
          href: '/manifest.json?v=0.1.2',
        },
      ],
      /* noscript: [
        {
          innerHTML: ymNoScript,
          tagPosition: 'bodyOpen',
        },
      ], */
    },
    pageTransition: {
      name: 'slide-right',
      mode: 'out-in',
    },
  },

  devServer: {
    port: 3001,
  },

  buildId: randomUUID(),
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-vuefire',
    // '@sentry/nuxt/module',
    'nuxt-svgo',
  ],

  nitro: {
    prerender: {
      ignore: ['/manifest.json'],
    },
  },

  vuefire: {
    config: {
      // apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      // authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      // projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      // storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      // messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      // appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      // measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      apiKey: 'AIzaSyAVDeaMARJSC4smML4xSViZ9j3eWysLfPM',
      authDomain:'cyber-pay-dev.firebaseapp.com',
      projectId: 'cyber-pay-dev',
      storageBucket: 'cyber-pay-dev.firebasestorage.app',
      messagingSenderId: '891978661856',
      appId: '1:891978661856:web:9d50ecda6af1118ebb3585',
      measurementId: 'G-RQJXQJLM9H',
    },
    version: '0.1.3',
  },

  $development: {
    devtools: { enabled: true },
    runtimeConfig: {
      public: {
        baseUrl: '',
        vapidKey: '',
        vapidKeyProd: '',
      },
      sentry: '',
      env: '',
    },
  },

  $production: {
    runtimeConfig: {
      public: {
        baseUrl: '',
        vapidKey:'BCl_Ox3WlGufBE9oMgNu7vYIu5tow8Ue8eX0zzTnJ6WTN4cqQHZ2N4qFIL3b9LPEJPqyqtttGNsSBLmjAROvAXw',
        vapidKeyProd: 'BM6Z9AWFP5pf9CKZJcsTZi5tSY7ddE-jtZAMBhUsYe7M-QH3Vss4PpsfCzOTdD--RReJw3K_5qZz6PLkfVYWTxE',
      },
      sentry: '',
      env: '',
    },
  },

  hooks: {
    'prerender:routes'({ routes }) {
      routes.clear();
    },
  },

  css: ['~/assets/css/index.scss', 'vue3-toastify/dist/index.css'],

  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'first' }],
    configPath: './tailwind.config.js',
  },

  sourcemap: {
    client: 'hidden',
  },

  // sentry: {
  //   sourceMapsUploadOptions: {
  //     org: 'sentry',
  //     project: 'cyberfront',
  //     authToken: process.env.NUXT_SENTRY_AUTH,
  //   },
  // },

  vite: {
    build: {
      cssCodeSplit: true,
      cssMinify: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: (() => {
          const uniqHash = Date.now();

          return {
            experimentalMinChunkSize: 500_000,
            entryFileNames: `_nuxt/[hash]${uniqHash}.js`,
            chunkFileNames: `_nuxt/[hash]${uniqHash}.js`,
            assetFileNames: `_nuxt/[hash]${uniqHash}[extname]`,
            manualChunks(id: string) {
              if (id?.includes('node_modules/vue-tel-input')) {
                return 'vue-tel-input';
              } else if (id?.includes('node_modules')) {
                return 'vendor';
              }
            },
          };
        })(),
      },
    },
  },

  routeRules: {
    '/**': { cache: { maxAge: 0 } },
    '/pwa/**': { cache: { maxAge: 0 } },
    '/icons/**': { cache: { maxAge: 24 * 60 * 60 } },
    '/images/**': { cache: { maxAge: 24 * 60 * 60 } },
    '/onboarding/**': { cache: { maxAge: 24 * 60 * 60 } },
  },
});