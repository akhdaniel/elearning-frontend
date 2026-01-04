// server/api/video/get-all-video.post.ts
import { odoo } from '~/../server/services/odoo'

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'session_id')
    const domain: any = []
    const specification = {
        id: {},
        name: {},
        sequence: {},
        keywords: {},
        coding: {},
        coding_explain: {},
        duration: {},
        coding_explain_orig: {},
        is_allow_preview: {},
        is_quiz: {},
        level: {},
        is_free_preview: {},
        is_standalone: {},
        list_price: {},
        is_generate_coding_exlain: {},
        active: {},
        topic_id: {
            fields: { display_name: {} }
        },
        program_id: {
            fields: { display_name: {} }
        },
        course_id: {
            fields: { display_name: {} }
        },
        audio_voice_id: {
            fields: { display_name: {} }
        },
        prompt_id: {
            fields: { display_name: {} }
        },
        survey_id: {
            fields: { display_name: {} }
        },
        currency_id: {
            fields: { display_name: {} }
        },
        product_fee_id: {
            fields: { display_name: {} }
        },
        media_type_id: {
            fields: { display_name: {} }
        },
        image: {},
        image_small: {},
        content: {},
        url: {},
        audio_file: {},
        image_file: {},
        video_file: {},
        my_progress: {},
        progressColor: {},
        quiz_result: {},
        allow_view: {},
        doc_cover: {},
        doc_file: {},
        pdf_link: {},
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

    const response = await odoo.webSearchRead("vit.video", domain, specification, limit, offset, sessionId)

    return {
        data: {
            records: response.data.result.records,
            total: response.data.result.length
        }
    }
})
