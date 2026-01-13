import { odoo } from '~/../server/services/odoo'

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'session_id')
    const domain: any = []
    const specification = {
        id: {},
        name: {},
        description: {},
        summary: {},
        active: {},
        instructor_id: {
            fields: { display_name: {} }
        },
        currency_id: {
            fields: { display_name: {} }
        },
        list_price: {},
        tuition_fee: {},
        onetime_price: {},
        cover_image2: {},
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

    const response = await odoo.webSearchRead("vit.program", domain, specification, limit, offset, sessionId)

    return {
        data: {
            records: response.data.result.records,
            total: response.data.result.length
        }
    }
})