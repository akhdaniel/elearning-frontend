// stores/auth.ts :
import { defineStore } from 'pinia'

type User = {
    uid: number
    name: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        loading: false
    }),

    actions: {
        async fetchUser() {
            this.loading = true
            try {
                this.user = await $fetch('/api/auth/me', {
                    credentials: 'include'
                })
            } catch {
                this.user = null
            } finally {
                this.loading = false
            }
        },

        async login(username: string, password: string) {
            this.loading = true
            try {
                this.user = await $fetch('/api/auth/login', {
                    method: 'POST',
                    body: { username, password },
                    credentials: 'include'
                })
            } catch {
                this.user = null
            } finally {
                this.loading = false
            }
        },

        async logout() {
            await $fetch('/api/auth/logout', { method: 'POST' })
            this.user = null
            await navigateTo('/login')
        }
    }
})
