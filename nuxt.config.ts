// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@pinia/nuxt',
        '@nuxt/ui',
        '@nuxt/icon'
    ],

    devtools: {
        enabled: true
    },

    css: ['~/assets/css/main.css'],

    routeRules: {
        '/': { prerender: true }
    },

    compatibilityDate: '2025-01-15',

    runtimeConfig: {
        odoo: {
            url: process.env.ODOO_URL,
            db: process.env.ODOO_DB
        },
        public: {
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
            appName: process.env.NUXT_PUBLIC_APP_NAME,
            defaultLanguage: process.env.NUXT_PUBLIC_DEFAULT_LANGUAGE
        }
    },

    eslint: {
        config: {
            stylistic: {
                commaDangle: 'never',
                braceStyle: '1tbs'
            }
        }
    }
})
