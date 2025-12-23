<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import type { VitCourse } from '~/../server/types/odoo'
import { useCourse } from '~/composables/useCourse'

const { getAllCourse } = useCourse()

// ===== State =====
const loading = ref(true)
const courses = ref<VitCourse[]>([])
const search = ref('')

onMounted(async () => {
    try {
        courses.value = await getAllCourse()
    } finally {
        loading.value = false
    }
})

const filteredCourses = computed(() => {
    if (!search.value) return courses.value
    return courses.value.filter(c =>
        c.name.toLowerCase().includes(search.value.toLowerCase())
    )
})
</script>

<template>
    <div class="space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold">Courses</h2>
                <p class="text-sm text-neutral-500 dark:text-neutral-400">
                    Explore and manage available learning courses
                </p>
            </div>

            <div class="flex gap-3 w-full md:w-auto">
                <UInput v-model="search" placeholder="Search course..." icon="i-heroicons-magnifying-glass"
                    class="w-full md:w-64" />
                <UButton icon="i-heroicons-adjustments-horizontal" variant="outline">
                    Filter
                </UButton>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <USkeleton v-for="i in 6" :key="i" class="h-56 rounded-xl" />
        </div>

        <!-- Empty State -->
        <UEmpty v-else-if="!filteredCourses.length" icon="i-heroicons-book-open" title="No courses found"
            description="Try adjusting your search or filter" />

        <!-- Course Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <UCard v-for="course in filteredCourses" :key="course.id" class="flex flex-col">
                <!-- Card Header -->
                <template #header>
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <h3 class="font-semibold leading-tight line-clamp-2">
                                {{ course.name }}
                            </h3>
                            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                {{ course.program_id?.display_name || 'General Program' }}
                            </p>
                        </div>
                        <UBadge :color="course.active ? 'success' : 'error'" variant="subtle" size="xs">
                            {{ course.active ? 'Active' : 'Inactive' }}
                        </UBadge>
                    </div>
                </template>

                <!-- Card Body -->
                <div class="space-y-4">
                    <p class="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">
                        {{ course.description || 'No description available.' }}
                    </p>

                    <div class="flex flex-wrap gap-2">
                        <UBadge v-if="course.is_standalone" variant="soft">Standalone</UBadge>
                        <UBadge v-if="course.is_optional" variant="soft" color="neutral">Optional</UBadge>
                        <UBadge v-if="course.lang_id" variant="soft" color="info">
                            {{ course.lang_id.display_name }}
                        </UBadge>
                    </div>
                </div>

                <!-- Card Footer -->
                <template #footer>
                    <div class="flex items-center justify-between">
                        <div class="text-sm font-medium">
                            {{ course.currency_id?.display_name || 'IDR' }} {{ course.list_price }}
                        </div>
                        <UButton size="sm" color="primary" variant="outline">
                            View Detail
                        </UButton>
                    </div>
                </template>
            </UCard>
        </div>
    </div>
</template>
