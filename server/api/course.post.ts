// server/api/course.post.ts
import { odoo } from '~/../server/services/odoo'

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'session_id')

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
    const body = await readBody(event)
    const page = Number(body.page || 1)
    const limit = Number(body.limit || 9)
    const search = body.search || ''

    const offset = (page - 1) * limit

    const domain: any[] = []
    if (search) {
        domain.push(['name', 'ilike', search])
    }

    const response = await odoo.webSearchRead("vit.course", domain, specification, limit, offset, sessionId)
    const count = await odoo.searchCount('vit.course', domain, sessionId)

    return {
        data: {
            records: response.data.result.records,
            total: count
        }
    }
})