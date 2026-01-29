// composables/useResLang.ts :
export function useResLang() {
    const getAllResLang = async (page: number = 1, limit: number = 9) => {
        return await $fetch(`/api/res-lang`, {
            method: "GET",
            credentials: "include",
            query: { page, limit }
        })
    }
    return { getAllResLang }
}