// composables/useContentPrompt.ts :
export function useContentPrompt() {
    const getAllContentPrompt = async (page: number = 1, limit: number = 10) => {
        return await $fetch(`/api/content-prompt`, {
            method: "GET",
            credentials: "include",
            query: { page, limit }
        })
    }
    return { getAllContentPrompt }
}