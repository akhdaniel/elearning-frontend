// composables/useProgram.ts :
import { ofetch } from "ofetch"

export function useProgram() {
    const getAllProgram = async () => {
        const res = await ofetch(`/api/program/get-all-program`, {
            method: "POST",
            credentials: "include",
        })
        return res.data
    }

    return { getAllProgram }
}