<!-- pages/dashboard/course/[id].vue -->
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCourse } from '~/composables/useCourse'
import { useBreadcrumb } from '~/composables/useBreadcrumb'
import type { VitCourse } from '~/../server/types/odoo'

definePageMeta({
    layout: 'dashboard',
})

const course = ref<VitCourse | null>(null)
const route = useRoute()
const courseId = Number(route.params.id)
const { getCourseById } = useCourse()
const { setBreadcrumb, clearBreadcrumb } = useBreadcrumb()

const { data, pending } = useAsyncData('course', () => getCourseById(courseId))
watchEffect(() => {
    if (data.value) {
        course.value = data.value
        setBreadcrumb([
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Course', to: '/dashboard/course' },
            {
                label: course.value?.name,
                to: route.fullPath
            }
        ])
    }
})

onBeforeUnmount(() => {
    clearBreadcrumb()
})
</script>

<template>
    <div class="space-y-8">

        <!-- Skeleton -->
        <div v-if="pending" class="space-y-6">
            <USkeleton class="h-8 w-2/3" />
            <USkeleton class="h-4 w-1/3" />
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <USkeleton class="h-64 lg:col-span-2" />
                <USkeleton class="h-64" />
            </div>
        </div>

        <!-- Content -->
        <div v-else-if="course" class="space-y-8">

            <!-- Header / Hero -->
            <div class="space-y-4">
                <div class="flex flex-wrap items-center gap-2">
                    <UBadge :color="course.active ? 'success' : 'error'" variant="subtle">
                        {{ course.active ? 'Active' : 'Inactive' }}
                    </UBadge>

                    <UBadge v-if="course.is_standalone" variant="soft">
                        Standalone
                    </UBadge>

                    <UBadge v-if="course.lang_id" color="info" variant="soft">
                        {{ course.lang_id.display_name }}
                    </UBadge>
                </div>

                <h1 class="text-3xl font-bold tracking-tight">
                    {{ course.name }}
                </h1>

                <p class="text-neutral-600 dark:text-neutral-300 max-w-3xl">
                    {{ course.description }}
                </p>
            </div>

            <!-- Main Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <!-- LEFT: Course Content -->
                <div class="lg:col-span-2 space-y-8">

                    <!-- About -->
                    <UCard>
                        <template #header>
                            <h3 class="text-lg font-semibold">About this course</h3>
                        </template>

                        <p class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                            {{ course.description }}
                        </p>
                    </UCard>

                    <!-- Videos / Lessons -->
                    <UCard>
                        <template #header>
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold">
                                    Course Content
                                </h3>
                                <span class="text-sm text-neutral-500">
                                    {{ course.video_ids?.length || 0 }} lessons
                                </span>
                            </div>
                        </template>

                        <ul class="divide-y divide-neutral-200 dark:divide-neutral-800">
                            <li v-for="(video, index) in course.video_ids" :key="video.id"
                                class="flex items-center justify-between py-3">
                                <div class="flex items-center gap-3">
                                    <span class="text-xs font-mono text-neutral-500 w-6">
                                        {{ Number(index) + 1 }}
                                    </span>
                                    <span class="text-sm font-medium">
                                        {{ video.name }}
                                    </span>
                                </div>

                                <UBadge size="xs" variant="soft">
                                    Lesson
                                </UBadge>
                            </li>
                        </ul>
                    </UCard>
                </div>

                <!-- RIGHT: Sidebar -->
                <div class="space-y-6">
                    <UCard class="sticky top-6">
                        <div class="space-y-4">
                            <div>
                                <p class="text-sm text-neutral-500">
                                    Course Fee
                                </p>
                                <p class="text-2xl font-bold">
                                    <span v-if="course.list_price === 0">
                                        Free
                                    </span>
                                    <span v-else>
                                        {{ course.currency_id?.display_name || 'IDR' }}
                                        {{ course.list_price }}
                                    </span>
                                </p>
                            </div>

                            <UButton size="lg" color="primary" block>
                                Enroll Now
                            </UButton>

                            <ul class="text-sm space-y-2">
                                <li class="flex justify-between">
                                    <span class="text-neutral-500">Type</span>
                                    <span class="font-medium">
                                        {{ course.is_standalone ? 'Standalone' : 'Program Based' }}
                                    </span>
                                </li>

                                <li class="flex justify-between">
                                    <span class="text-neutral-500">Language</span>
                                    <span class="font-medium">
                                        {{ course.lang_id?.display_name || '-' }}
                                    </span>
                                </li>

                                <li class="flex justify-between">
                                    <span class="text-neutral-500">Lessons</span>
                                    <span class="font-medium">
                                        {{ course.video_ids?.length || 0 }}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </UCard>
                </div>
            </div>
        </div>
    </div>
</template>
