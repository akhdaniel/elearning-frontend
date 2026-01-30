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
        topics: {},
        summary: {},
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
        topic_ids: {
            fields: {
                id: {},
                name: {},
                description: {},
                survey_id: {
                    fields: { display_name: {} }
                },
                quiz_prompt_id: {
                    fields: { display_name: {} }
                },
                course_id: {
                    fields: { display_name: {} }
                },
                video_ids: {
                    fields: {
                        id: {},
                        name: {},
                        description: {},
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

    return response.data.result[0]
})
