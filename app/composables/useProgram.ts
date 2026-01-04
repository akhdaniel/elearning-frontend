// composables/useProgram.ts :
import { ofetch } from "ofetch"

interface ProgramQuery {
    page: number
    limit: number
}

export function useProgram() {
    const getAllProgram = async (query: ProgramQuery) => {
        const res = await ofetch(`/api/program/get-all-program`, {
            method: "POST",
            credentials: "include",
            body: query
        })
        return res.data
    }

    return { getAllProgram }
}