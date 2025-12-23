// composables/useCourse.ts :
import { ofetch } from "ofetch"

export function useCourse() {
    const getAllCourse = async () => {
        const res = await ofetch(`/api/course/get-all-course`, {
            method: "POST",
            credentials: "include",
        })
        return res.data
    }

    return { getAllCourse }
}