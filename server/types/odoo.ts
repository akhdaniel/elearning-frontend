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
    instructor_id: any
    currency_id: object
    list_price: number
    tuition_fee: number
    onetime_price: number
    cover_image2: string | null
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
    sequence: number
    keywords: string
    coding: string
    coding_explain: string
    duration: number
    coding_explain_orig: string
    is_allow_preview: boolean,
    is_quiz: boolean,
    level: number
    is_free_preview: boolean,
    is_standalone: boolean,
    list_price: number
    is_generate_coding_exlain: boolean,
    active: boolean,
    topic_id: object,
    program_id: object,
    course_id: object,
    audio_voice_id: object,
    prompt_id: object,
    survey_id: object,
    currency_id: object,
    product_fee_id: object,
    media_type_id: object,
    image: string,
    image_small: string,
    content: string,
    url: string,
    audio_file: string,
    image_file: string,
    video_file: string,
    my_progress: number,
    progressColor: string,
    quiz_result: number,
    allow_view: boolean,
    doc_cover: string,
    doc_file: string,
    pdf_link: string,
}
