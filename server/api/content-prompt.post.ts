// server/api/course.post.ts
import { odoo } from '~/../server/services/odoo'

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'session_id')

    const specification = {
        id: {},
        name: {},
        system_prompt: {},
        user_prompt: {},
        active: {},
        gpt_model_id: {
            fields: { name: {} }
        },
        lang_id: {
            fields: { display_name: {} }
        },
    }

    if (!sessionId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'UNAUTHORIZED'
        })
    }

    await odoo.getSessionInfo(sessionId)
    const body = await readBody(event)
    const page = Number(body.page || 1)
    const limit = Number(body.limit || 9)

    const offset = (page - 1) * limit

    const domain: any[] = []

    const response = await odoo.webSearchRead("vit.content_prompt", domain, specification, limit, offset, sessionId)
    const count = await odoo.searchCount("vit.content_prompt", domain, sessionId)

    return {
        data: {
            records: response.data.result.records,
            total: count
        }
    }
})