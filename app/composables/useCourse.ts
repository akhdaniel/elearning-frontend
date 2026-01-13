// composables/useCourse.ts :
interface CourseQuery {
    page: number
    limit: number
    search?: string
}

export function useCourse() {
    const getAllCourse = async (query: CourseQuery) => {
        const res = await $fetch(`/api/course`, {
            method: "POST",
            credentials: "include",
            body: query
        })
        return res.data
    }

    const getCourseById = async (id: number) => {
        const res = await $fetch(`/api/course/${id}`, {
            method: "GET",
            credentials: "include",
        })
        return res.data
    }

    return { getAllCourse, getCourseById }
}