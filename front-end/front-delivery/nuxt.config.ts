
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  compatibilityDate: '2025-02-19',
  runtimeConfig: {
    apiBaseUrl: 'http://localhost:4000', // Base URL for the back-end API
  },

});
