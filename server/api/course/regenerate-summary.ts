// server/api/course/generate-topics.post.ts
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
    const courseId = Number(body)

    const response = await odoo.callButton({
        model: "vit.course",
        method: "regenerate_summary",
        args: [[courseId]],
        sessionId: sessionId
    })

    return {
        success: true,
        message: "Summary regenerated successfully",
        data: response
    }
})