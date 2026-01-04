<!-- pages/dashboard/video/index.vue -->
<script setup lang="ts">
import type { VitVideo } from '~/../server/types/odoo'
import { useVideo } from '~/composables/useVideo'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'E-Learning System | Video'
})

const { getAllVideo } = useVideo()

const loading = ref(true)
const videos = ref<VitVideo[]>([])

const page = ref(1)
const perPage = 9
const total = ref(0)

const fetchVideos = async () => {
    loading.value = true
    try {
        const res = await getAllVideo({
            page: page.value,
            limit: perPage
        })
        videos.value = res.records
        total.value = res.total
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchVideos()
})

watch([page], () => {
    page.value = page.value < 1 ? 1 : page.value
    fetchVideos()
})

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(value)

const getCoverImage = (cover: string | null) => {
    if (!cover) {
        return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200'
    }

    return `data:image/jpeg;base64,${cover}`
}

</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-semibold">Video Pembelajaran</h1>
                <p class="text-sm text-gray-500">
                    Daftar video pembelajaran yang tersedia pada sistem e-learning
                </p>
            </div>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <UCard v-for="i in 6" :key="i">
                <USkeleton class="h-40 w-full mb-4" />
                <USkeleton class="h-4 w-3/4 mb-2" />
                <USkeleton class="h-3 w-1/2" />
            </UCard>
        </div>

        <!-- Empty State -->
        <UEmpty v-else-if="videos.length === 0" icon="i-heroicons-video-camera-slash" title="Video tidak tersedia"
            description="Belum ada video yang dapat ditampilkan." />

        <!-- Video Grid -->
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <UCard v-for="video in videos" :key="video.id" class="group hover:shadow-lg transition">
                <!-- Thumbnail -->
                <div class="relative mb-3">
                    <img :src="getCoverImage(video.image_small)" alt="Video Thumbnail"
                        class="h-40 w-full object-cover rounded-lg" />

                    <!-- Preview Badge -->
                    <UBadge v-if="video.is_free_preview" color="success" variant="solid" size="xs"
                        class="absolute top-2 left-2">
                        Free Preview
                    </UBadge>

                    <!-- Duration -->
                    <span v-if="video.duration"
                        class="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-2 py-0.5 rounded">
                        {{ video.duration }} menit
                    </span>
                </div>

                <!-- Title -->
                <h3 class="font-medium line-clamp-2 mb-1">
                    {{ video.name }}
                </h3>

                <!-- Meta -->
                <div class="text-xs text-gray-500 space-y-1 mb-3">
                    <div v-if="video.course_id">
                        Course: {{ (video.course_id as any).display_name }}
                    </div>
                    <div v-if="video.level">
                        Level: {{ video.level }}
                    </div>
                </div>

                <!-- Progress -->
                <div v-if="video.my_progress !== undefined" class="mb-3">
                    <UProgress v-model="video.my_progress" size="xs" />
                    <p class="text-xs text-gray-500 mt-1">
                        Progress: {{ video.my_progress }}%
                    </p>
                </div>

                <!-- Footer -->
                <div class="flex items-center justify-between mt-4">
                    <div class="flex gap-2">
                        <UBadge v-if="video.is_quiz" color="info" variant="subtle" size="xs">
                            Quiz
                        </UBadge>

                        <UBadge v-if="video.list_price === 0" color="success" variant="subtle" size="xs">
                            Gratis
                        </UBadge>

                        <UBadge v-else color="neutral" variant="subtle" size="xs">
                            {{ formatCurrency(video.list_price) }}
                        </UBadge>
                    </div>

                    <UButton size="xs" icon="i-heroicons-play-circle" :disabled="!video.allow_view">
                        Tonton
                    </UButton>
                    <!-- <UButton size="xs" icon="i-heroicons-play-circle" :disabled="!video.allow_view"
                        @click="navigateTo(`/dashboard/video/${video.id}`)">
                        Tonton
                    </UButton> -->
                </div>
            </UCard>
        </div>

        <!-- Pagination -->
        <div v-if="total > perPage" class="flex justify-center pt-4">
            <UPagination v-model:page="page" :items-per-page="perPage" :total="total" size="sm" />
        </div>
    </div>
</template>