<!-- pages/dashboard/course/index.vue -->
<script setup lang="ts">
import type { VitCourse } from '~/../server/types/odoo'
import { useCourse } from '~/composables/useCourse'
import { useBreadcrumb } from '~/composables/useBreadcrumb'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'E-Learning System | Course'
})

const { getAllCourse } = useCourse()
const { setBreadcrumb, clearBreadcrumb } = useBreadcrumb()

const courses = ref<VitCourse[]>([])
const search = ref('')

const page = ref(1)
const perPage = 9
const total = ref(0)

const { data, pending } = useAsyncData('courses', () => getAllCourse(page.value, perPage, search.value), {
    watch: [page, search]
})

watchEffect(() => {
    if (data.value) {
        courses.value = (data.value.data as { records: VitCourse[]; total: number }).records
        total.value = (data.value.data as { records: VitCourse[]; total: number }).total

        setBreadcrumb([
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Course' },
        ])
    }
})

watch(search, () => {
    page.value = 1
})

onBeforeUnmount(() => {
    clearBreadcrumb()
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

            <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <UInput v-model="search" placeholder="Search course..." icon="i-heroicons-magnifying-glass"
                    class="w-full md:w-64" />

                <UButton icon="i-heroicons-plus" color="primary" variant="solid" label="Add Course"
                    class="whitespace-nowrap cursor-pointer" @click="navigateTo('/dashboard/course/create')" />
            </div>
        </div>

        <!-- Loading -->
        <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <USkeleton v-for="i in 6" :key="i" class="h-56 rounded-xl" />
        </div>

        <!-- Empty State -->
        <UEmpty v-else-if="!courses.length" icon="i-heroicons-book-open" title="No courses found"
            description="Try adjusting your search or filter" />

        <!-- Course Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink v-for="course in courses" :key="course.id" :to="`/dashboard/course/${course.id}`" class="block">

                <UCard class="group flex flex-col h-full hover:shadow-lg transition-shadow">
                    <div class="flex flex-col h-full">
                        <!-- ===== Content Area ===== -->
                        <div class="flex flex-col gap-4 flex-1">
                            <!-- Status -->
                            <UBadge :color="course.active ? 'success' : 'error'" variant="subtle" size="xs"
                                class="w-fit">
                                {{ course.active ? 'Active' : 'Inactive' }}
                            </UBadge>

                            <!-- Title & Program -->
                            <div>
                                <h3
                                    class="font-semibold text-base leading-snug line-clamp-2 text-neutral-900 dark:text-neutral-100">
                                    {{ course.name }}
                                </h3>
                                <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                    {{ course.program_id?.display_name || 'General Program' }}
                                </p>
                            </div>

                            <!-- Description (height normalized) -->
                            <p class="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3 min-h-15">
                                {{ course.description || 'No description available.' }}
                            </p>

                            <!-- Meta Badges -->
                            <div class="flex flex-wrap gap-2">
                                <UBadge v-if="course.is_standalone" variant="soft">
                                    Standalone
                                </UBadge>
                                <UBadge v-if="course.is_optional" variant="soft" color="neutral">
                                    Optional
                                </UBadge>
                                <UBadge v-if="course.lang_id" variant="soft" color="info">
                                    {{ course.lang_id.display_name }}
                                </UBadge>
                            </div>
                        </div>

                        <!-- ===== Price & Action ===== -->
                        <div class="pt-4 flex items-center justify-between">
                            <div class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                {{ course.currency_id?.display_name || 'IDR' }} {{ course.list_price }}
                            </div>
                            <UButton size="sm" color="primary" variant="solid" class="min-w-24" @click.stop>
                                View Detail
                            </UButton>
                        </div>
                    </div>
                </UCard>
            </NuxtLink>
        </div>

        <!-- Pagination -->
        <div v-if="total > perPage" class="flex justify-center mt-8">
            <UPagination v-model:page="page" :items-per-page="perPage" :total="total" size="sm" />
        </div>
    </div>
</template>
