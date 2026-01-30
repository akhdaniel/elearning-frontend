// composables/useTopic.ts :
export function useTopic() {
    const getAllTopic = async (page: number = 1, limit: number = 9) => {
        return await $fetch(`/api/topic`, {
            method: "GET",
            credentials: "include",
            query: { page, limit }
        })
    }

    const createTopic = async (payload: any) => {
        return await $fetch(`/api/topic`, {
            method: "POST",
            credentials: "include",
            body: { data: payload }
        })
    }

    const updateTopic = async (id: number, payload: any) => {
        return await $fetch(`/api/topic/${id}`, {
            method: "PATCH",
            credentials: "include",
            body: payload
        })
    }

    return { getAllTopic, createTopic, updateTopic }
}