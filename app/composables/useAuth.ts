// composables/useAuth.ts
export const useAuth = () => {
    const login = (username: string, password: string) =>
        $fetch('/api/auth/login', {
            method: 'POST',
            body: { username, password },
            credentials: 'include'
        })

    const logout = () =>
        $fetch('/api/auth/logout', { method: 'POST' })

    const me = () =>
        $fetch('/api/auth/me', {
            credentials: 'include'
        })

    return {
        login,
        logout,
        me
    }
}
