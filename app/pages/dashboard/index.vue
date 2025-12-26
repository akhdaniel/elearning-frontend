<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

// ===== Static dummy data =====
const stats = [
    { label: 'Total Courses', value: 24, icon: 'i-heroicons-book-open' },
    { label: 'Active Students', value: 1_240, icon: 'i-heroicons-users' },
    { label: 'Completed Courses', value: 312, icon: 'i-heroicons-check-badge' },
    { label: 'Average Progress', value: '68%', icon: 'i-heroicons-chart-bar' }
]

const recentCourses = ref([
    {
        title: 'Vue & Nuxt Fundamentals',
        category: 'Frontend Development',
        progress: 72,
        instructor: 'John Doe'
    },
    {
        title: 'Odoo ERP Customization',
        category: 'Enterprise System',
        progress: 45,
        instructor: 'Jane Smith'
    },
    {
        title: 'Database Design with PostgreSQL',
        category: 'Backend',
        progress: 90,
        instructor: 'Michael Lee'
    }
])

const activities = [
    { text: 'You enrolled in "Vue & Nuxt Fundamentals"', time: '2 hours ago' },
    { text: 'You completed lesson "State Management"', time: 'Yesterday' },
    { text: 'New course available: "Advanced Tailwind"', time: '2 days ago' }
]

const value2 = ref(50)

</script>

<template>
    <div class="space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold">Welcome back</h2>
                <p class="text-sm text-neutral-500 dark:text-neutral-400">
                    Here is an overview of your learning progress
                </p>
            </div>
            <UButton icon="i-heroicons-plus" color="primary">
                Browse Courses
            </UButton>
        </div>

        <!-- Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="stat in stats" :key="stat.label"
                class="bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-sm border border-neutral-200/60 dark:border-neutral-800">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ stat.label }}</p>
                        <p class="text-2xl font-semibold mt-1">{{ stat.value }}</p>
                    </div>
                    <div class="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <UIcon :name="stat.icon" class="text-xl" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Courses Progress -->
            <div
                class="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6 border border-neutral-200/60 dark:border-neutral-800">
                <h3 class="text-lg font-semibold mb-4">Your Courses</h3>

                <div class="space-y-4">
                    <div v-for="course in recentCourses" :key="course.title"
                        class="p-4 rounded-lg border border-neutral-200/60 dark:border-neutral-800">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <h4 class="font-medium">{{ course.title }}</h4>
                                <p class="text-xs text-neutral-500 dark:text-neutral-400">
                                    {{ course.category }} • Instructor: {{ course.instructor }}
                                </p>
                            </div>
                            <UButton size="xs" variant="outline">Continue</UButton>
                        </div>

                        <div class="mt-3">
                            <div class="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{{ course.progress }}%</span>
                            </div>
                            <UProgress v-model="course.progress" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activities -->
            <div
                class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-6 border border-neutral-200/60 dark:border-neutral-800">
                <h3 class="text-lg font-semibold mb-4">Recent Activities</h3>
                <ul class="space-y-4">
                    <li v-for="activity in activities" :key="activity.text" class="flex gap-3">
                        <div class="h-2 w-2 rounded-full bg-primary mt-2" />
                        <div>
                            <p class="text-sm">{{ activity.text }}</p>
                            <span class="text-xs text-neutral-500 dark:text-neutral-400">
                                {{ activity.time }}
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
