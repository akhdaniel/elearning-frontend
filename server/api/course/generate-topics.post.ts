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
    const response = await odoo.callKw({
        model: "vit.course",
        method: "action_generate_topics",
        args: [body],
        sessionId: sessionId
    })
    console.log("response : ", response);

    return {
        success: true,
        message: "Topics generated successfully",
    }
})