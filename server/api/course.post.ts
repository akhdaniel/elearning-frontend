// server/api/course.post.ts
import { odoo } from '~/../server/services/odoo'

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'session_id')
    if (!sessionId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'UNAUTHORIZED'
        })
    }
    await odoo.getSessionInfo(sessionId)
    const body = await readBody(event)
    const response = await odoo.callKw({
        model: "vit.course",
        method: "create",
        args: [body],
        sessionId: sessionId
    })
    return {
        success: true,
        message: "Course created successfully",
        data: response.data.result
    }
})