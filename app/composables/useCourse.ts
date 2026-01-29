// composables/useCourse.ts :
export function useCourse() {
    const createCourse = async (payload: any) => {
        return await $fetch(`/api/course`, {
            method: "POST",
            credentials: "include",
            body: payload
        })
    }

    const updateCourse = async (id: number, payload: any) => {
        return await $fetch(`/api/course/${id}`, {
            method: "PATCH",
            credentials: "include",
            body: payload
        })
    }

    const getAllCourse = async (page: number = 1, limit: number = 10, search: string) => {
        return await $fetch(`/api/course`, {
            method: "GET",
            credentials: "include",
            query: { page, limit, search }
        })
    }

    const getCourseById = async (id: number) => {
        return await $fetch(`/api/course/${id}`, {
            method: "GET",
            credentials: "include",
        })
    }

    const generateTopics = async (payload: any) => {
        return await $fetch(`/api/course/generate-topics`, {
            method: "POST",
            credentials: "include",
            body: payload
        })
    }

    return { createCourse, updateCourse, getAllCourse, getCourseById, generateTopics }
}