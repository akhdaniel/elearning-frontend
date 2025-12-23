// server/api/auth/logout.post.ts
import { odoo } from '~/../server/services/odoo'

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'session_id')

    if (sessionId) {
        await odoo.logout(sessionId)
    }

    deleteCookie(event, 'session_id', {
        path: '/'
    })

    return { success: true }
})
