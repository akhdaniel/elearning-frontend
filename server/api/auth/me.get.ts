import { odoo } from '~/../server/services/odoo'

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'session_id')

    if (!sessionId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'UNAUTHORIZED'
        })
    }

    const result = await odoo.getSessionInfo(sessionId)

    return {
        uid: result.data.uid,
        name: result.data.name,
        login: result.data.login
    }
})
