export default defineNuxtRouteMiddleware(async (to) => {
    const auth = useAuthStore()

    const publicPages = ['/login']
    const isPublic = publicPages.includes(to.path)

    // SSR-safe: jika sudah ada user di store
    if (auth.user) {
        if (isPublic) {
            return navigateTo('/dashboard')
        }
        return
    }

    try {
        await auth.fetchUser()

        if (!auth.user && !isPublic) {
            return navigateTo('/login')
        }

        if (auth.user && isPublic) {
            return navigateTo('/dashboard')
        }
    } catch {
        if (!isPublic) {
            return navigateTo('/login')
        }
    }
})
