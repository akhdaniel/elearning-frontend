// server/api/course/get-all-course.post.ts
import { odoo } from '~/../server/services/odoo'

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'session_id')
    const params = event.context.params
    const courseId = Number(params?.id)

    const specification = {
        id: {},
        name: {},
        description: {},
        active: {},
        list_price: {},
        is_standalone: {},
        is_optional: {},
        period_id: {
            fields: { display_name: {} }
        },
        program_id: {
            fields: { display_name: {} }
        },
        prompt_id: {
            fields: { display_name: {} }
        },
        summary_prompt_id: {
            fields: { display_name: {} }
        },
        product_fee_id: {
            fields: { display_name: {} }
        },
        currency_id: {
            fields: { display_name: {} }
        },
        lang_id: {
            fields: { display_name: {} }
        },
        video_ids: {
            fields: {
                id: {},
                name: {},
                topic_id: {
                    fields: { display_name: {} }
                },
            }
        },
    }

    if (!sessionId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'UNAUTHORIZED'
        })
    }

    await odoo.getSessionInfo(sessionId)
    const ids: any[] = [courseId]
    const response = await odoo.webRead("vit.course", ids, specification, sessionId)

    return {
        data: response.data.result[0],
    }
})
