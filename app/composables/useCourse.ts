// composables/useCourse.ts :
interface CourseQuery {
    page: number
    limit: number
    search?: string
}

export function useCourse() {
    const createCourse = async (query: CourseQuery) => {
        const res = await $fetch(`/api/course`, {
            method: "POST",
            credentials: "include",
            body: query
        })
        return res.data
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

    return { createCourse, getAllCourse, getCourseById }
}