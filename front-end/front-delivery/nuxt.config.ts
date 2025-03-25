// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Server target
  ssr: true,

  // Server configuration
  devServer: {
    port: 3000
  },

  // Head configuration
  app: {
    head: {
      title: 'Delivery App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    }
  },

  modules: [
    '@nuxt/ui'
  ],

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:4000'
    }
  },

  compatibilityDate: '2025-03-24'
});