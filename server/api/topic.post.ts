// server/api/course.post.ts
import { odoo } from '~/../server/services/odoo'

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'session_id')
    const body = await readBody(event)
    const form = body.data || {}
    const req = form.data

    const payload = {
        name: req.name,
        sequence: req.requence,
        active: req.active,
        course_id: Number(req.course_id),
    }

    const res = await odoo.callKw("vit.topic", "create", [payload], [], sessionId)
    return {
        data: {
            result: res.data.result
        }
    }
})