import { odoo } from '~/../server/services/odoo'
import type { VitProgram } from '~/../server/types/odoo'

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
    }

    if (!sessionId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'UNAUTHORIZED'
        })
    }

    await odoo.getSessionInfo(sessionId)

    const response = await odoo.webSearchRead("vit.program", domain, specification, 80, sessionId)

    return {
        data: response.data.result.records as VitProgram[]
    }
})
