import { odoo } from '~/../server/services/odoo'

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'session_id')
    const query = getQuery(event)
    const domain: any = []
    const specification = {
        id: {},
        name: {},
        sequence: {},
        is_quiz: {},
        is_optional: {},
        is_published: {},
        description: {},
        image: {},
        active: {},
        quiz_content: {},
        course_id: {
            fields: { display_name: {} }
        },
        survey_id: {
            fields: { display_name: {} }
        },
        quiz_prompt_id: {
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
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 9
    const offset = (page - 1) * limit

    const response = await odoo.webSearchRead("vit.topic", domain, specification, limit, offset, sessionId)

    return {
        data: {
            records: response.data.result.records,
            total: response.data.result.length
        }
    }
})