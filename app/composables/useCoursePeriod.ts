// composables/useCoursePeriod.ts :
export function useCoursePeriod() {
    const getAllCoursePeriod = async (page: number = 1, limit: number = 9) => {
        return await $fetch(`/api/course-period`, {
            method: "GET",
            credentials: "include",
            query: { page, limit }
        })
    }
    return { getAllCoursePeriod }
}