// server/api/course/create-content.post.ts
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
        method: "action_create_content",
        args: [[courseId]],
        sessionId: sessionId
    })

    console.log("response : ", response);


    return {
        success: true,
        message: "Content created successfully",
        data: response
    }
})