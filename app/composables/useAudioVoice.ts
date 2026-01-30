// composables/useAudioVoice.ts :
export function useAudioVoice() {
    const getAllAudioVoice = async (page: number = 1, limit: number = 9) => {
        return await $fetch(`/api/audio-voice`, {
            method: "GET",
            credentials: "include",
            query: { page, limit }
        })
    }
    return { getAllAudioVoice }
}