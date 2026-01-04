// composables/useCourse.ts :
import { ofetch } from "ofetch"

interface CourseQuery {
    page: number
    limit: number
    search?: string
}

export function useCourse() {
    const getAllCourse = async (query: CourseQuery) => {
        const res = await ofetch(`/api/course/get-all-course`, {
            method: "POST",
            credentials: "include",
            body: query
        })
        return res.data
    }

    const getCourseById = async (id: number) => {
        const res = await ofetch(`/api/course/${id}`, {
            method: "GET",
            credentials: "include",
        })
        return res.data.records
    }

    return { getAllCourse, getCourseById }
}