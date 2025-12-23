// server/types/odoo.ts :

export type OdooLoginResult = {
    uid: number
    name: string
    headers: string
}

export type OdooSessionInfo = {
    uid: number
    name: string
    login: string
    company_id: number
    partner_id: number
    user_context?: {
        allowed_groups?: string[]
        allowed_company_ids?: number[]
    }
}

export type VitProgram = {
    id: number
    name: string
    description: string
    summary: string
    active: boolean
    instructor_id: object
    currency_id: object
    list_price: number
    tuition_fee: number
    onetime_price: number
}

export type VitCourse = {
    id: number,
    name: string,
    description: string,
    active: boolean,
    list_price: number,
    is_standalone: boolean,
    is_optional: boolean,
    period_id: object,
    program_id: any,
    prompt_id: object,
    summary_prompt_id: object,
    product_fee_id: object,
    currency_id: any,
    lang_id: any,
    video_ids: any
}

export type VitVideo = {
    id: number
    name: string
}
