// composables/useResCurrency.ts :
export function useResCurrency() {
    const getAllResCurrency = async (page: number = 1, limit: number = 9) => {
        return await $fetch(`/api/res-currency`, {
            method: "GET",
            credentials: "include",
            query: { page, limit }
        })
    }
    return { getAllResCurrency }
}