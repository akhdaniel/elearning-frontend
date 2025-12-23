export default defineNuxtRouteMiddleware(async (to) => {
    const auth = useAuthStore()

    // halaman publik
    const publicPages = ['/login']
    const isPublic = publicPages.includes(to.path)

    // sudah punya user → lanjut
    if (auth.user) {
        return
    }

    try {
        // cek session ke server (SSR-safe)
        await auth.fetchUser()

        if (!auth.user && !isPublic) {
            return navigateTo('/login')
        }

        // sudah login tapi buka /login → redirect
        if (auth.user && isPublic) {
            return navigateTo('/dashboard')
        }
    } catch {
        if (!isPublic) {
            return navigateTo('/login')
        }
    }
})