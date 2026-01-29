// composables/useProgram.ts :
import { ofetch } from "ofetch"

interface ProgramQuery {
    page: number
    limit: number
}

export function useProgram() {
    const getAllProgram = async (query: ProgramQuery) => {
        const res = await ofetch(`/api/program`, {
            method: "POST",
            credentials: "include",
            body: query
        })
        return res.data
    }

    const getProgram = async (page: number = 1, limit: number = 9) => {
        return await $fetch(`/api/program`, {
            method: "GET",
            credentials: "include",
            query: { page, limit }
        })
    }

    return { getAllProgram, getProgram }
}