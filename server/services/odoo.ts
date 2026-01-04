// server/services/odoo.ts
import { $fetch } from 'ofetch'
import type { OdooLoginResult, OdooSessionInfo } from '~/../server/types/odoo'

export class Odoo {
    private baseUrl: string
    private db: string

    constructor() {
        const config = useRuntimeConfig()

        if (!config.odoo?.url || !config.odoo?.db) {
            throw new Error('Odoo runtime configuration is missing')
        }

        this.baseUrl = config.odoo.url
        this.db = config.odoo.db
    }

    private async request(path: string, options: any = {}, sessionId?: string) {
        const response = await $fetch.raw(`${this.baseUrl}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(sessionId ? { Cookie: `session_id=${sessionId}` } : {}),
                ...(options.headers || {})
            }
        })

        const error = (response._data as any)?.error
        if (error) {
            const isSessionExpired =
                error.message === 'Odoo Session Expired' ||
                error.data?.exception_type === 'access_denied' ||
                error.data?.message?.includes('Session expired')

            if (isSessionExpired) {
                throw createError({
                    statusCode: 401,
                    statusMessage: 'ODOO_SESSION_EXPIRED'
                })
            }

            throw createError({
                statusCode: 500,
                statusMessage: error.message || 'Odoo API Error'
            })
        }

        return {
            data: response._data,
            headers: response.headers
        }
    }


    // =========================
    // AUTH
    // =========================

    async login(login: string, password: string) {
        return this.request('/web/session/authenticate',
            {
                method: 'POST',
                body: {
                    params: {
                        db: this.db,
                        login,
                        password
                    }
                }
            }
        )
    }

    async logout(sessionId: string) {
        return this.request('/web/session/destroy',
            {
                method: 'POST',
                body: {
                    params: {
                        db: this.db
                    }
                }
            },
            sessionId
        )
    }

    async getSessionInfo(sessionId: string) {
        return this.request('/web/session/get_session_info',
            {
                method: 'POST',
                body: {}
            },
            sessionId
        )
    }

    // =========================
    // ORM
    // =========================

    async webSearchRead(model: string, domain: any[] = [], specification: any = {}, limit = 9, offset = 0, sessionId?: string) {
        return this.request(`/web/dataset/call_kw/${model}/web_search_read`,
            {
                method: 'POST',
                body: {
                    params: {
                        model,
                        method: 'web_search_read',
                        args: [],
                        kwargs: {
                            domain,
                            specification,
                            limit,
                            offset
                        }
                    }
                }
            },
            sessionId
        )
    }

    async webRead(model: string, ids: any[], specification: any = {}, sessionId?: string) {
        return this.request(`/web/dataset/call_kw/${model}/web_read`,
            {
                method: 'POST',
                body: {
                    params: {
                        model,
                        method: 'web_read',
                        args: ids,
                        kwargs: {
                            specification
                        }
                    }
                }
            },
            sessionId
        )
    }

    async webSave(model: string, ids: any[], specification = {}, sessionId?: string) {
        return this.request(`/web/dataset/call_kw/${model}/web_save`,
            {
                method: 'POST',
                body: {
                    params: {
                        model,
                        method: 'web_save',
                        args: ids,
                        kwargs: {
                            specification
                        }
                    }
                }
            },
            sessionId
        )
    }
}

export const odoo = new Odoo()
