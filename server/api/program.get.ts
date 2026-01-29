import { odoo } from '~/../server/services/odoo'

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'session_id')
    const query = getQuery(event)
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
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 9
    const offset = (page - 1) * limit
    const domain: any[] = []

    const response = await odoo.webSearchRead("vit.program", domain, specification, limit, offset, sessionId)

    return response.data.result.records
})