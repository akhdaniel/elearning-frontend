// composables/useProgram.ts :
import { ofetch } from "ofetch"

export function useVideo() {
    const getAllVideo = async () => {
        const res = await ofetch(`/api/video/get-all-video`, {
            method: "POST",
            credentials: "include",
        })
        return res.data
    }

    return { getAllVideo }
}