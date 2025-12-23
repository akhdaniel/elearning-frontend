// server/api/auth/login.post.ts
import { defineEventHandler, readBody, setCookie } from 'h3'
import { odoo } from '~/../server/services/odoo'

const getSessionIdFromHeaders = (responseHeaders: Headers): string | null => {
    const cookies = responseHeaders.get('set-cookie')
    if (!cookies) return null

    const cookieArray = Array.isArray(cookies) ? cookies : [cookies]

    for (const cookie of cookieArray) {
        const match = cookie.match(/session_id=([^;]+)/)
        if (match) {
            return match[1]
        }
    }
    return null
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const result = await odoo.login(body.username, body.password)
    const sessionId = getSessionIdFromHeaders(result.headers)

    if (!sessionId) {
        return { error: 'Odoo tidak mengembalikan session_id di header Set-Cookie' }
    }

    setCookie(event, 'session_id', sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    })

    return {
        uid: result.data.result.uid,
        name: result.data.result.name
    }
})
