export default {
  // Server-side rendering
  ssr: true,

  // Server target
  target: 'server',

  // Router configuration
  router: {
    middleware: ['auth']
  },

  // Head configuration
  head: {
    title: 'Delivery App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
  },

  // Build modules
  buildModules: ['@nuxtjs/tailwindcss'],

  // Plugins
  plugins: [],

  // Axios configuration
  axios: {
    baseURL: 'http://localhost:4000',
  },

  // Server configuration
  server: {
    port: 3000,
  },

  compatibilityDate: '2025-02-23'
};