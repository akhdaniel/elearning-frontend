// server/api/topic/[id].patch.ts
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
    const id = Number(event.context.params!.id)
    console.log("body : ", body);
    console.log("id : ", id);

    const response = await odoo.callKw({
        model: "vit.topic",
        method: "write",
        args: [[id], body],
        sessionId: sessionId
    })
    console.log("response update : ", response);

    return {
        success: true,
        message: "Topic updated successfully",
        data: response
    }
})