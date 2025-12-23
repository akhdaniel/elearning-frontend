import { odoo } from '~/../server/services/odoo'
import type { VitVideo } from '~/../server/types/odoo'

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'session_id')
    const domain: any = []
    const specification = {
        id: {},
        name: {},
    }

    if (!sessionId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'UNAUTHORIZED'
        })
    }

    await odoo.getSessionInfo(sessionId)

    const response = await odoo.webSearchRead("vit.video", domain, specification, 80, sessionId)

    return {
        data: response.data.result.records as VitVideo[]
    }
})
