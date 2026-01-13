// composables/useProgram.ts :
import { ofetch } from "ofetch"

interface VideoQuery {
    page: number
    limit: number
}

export function useVideo() {
    const getAllVideo = async (query: VideoQuery) => {
        const res = await ofetch(`/api/video`, {
            method: "POST",
            credentials: "include",
            body: query
        })
        return res.data
    }
    return { getAllVideo }
}