// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/a11y',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui'
  ],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  },
  imports: {
    dirs: [
      // Scan top-level modules
      'composables',
      // Scan nested directories
      'composables/**'
    ]
  }
})