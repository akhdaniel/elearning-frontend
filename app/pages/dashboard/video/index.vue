<script setup lang="ts">
import { useVideo } from '~/composables/useVideo'

definePageMeta({ layout: 'dashboard' })

const { getAllVideo } = useVideo()

const videoData = ref<any[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

const getAllVideos = async () => {
    isLoading.value = true
    try {
        const result = await getAllVideo()
        videoData.value = result
    } catch (error) {
        errorMessage.value = 'Koneksi ke server gagal. Coba lagi nanti.'
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

onMounted(getAllVideos)

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(value)
</script>

<template>
    <div class="space-y-6">
        <!-- Page Header -->
        <div>
            <h2 class="text-2xl font-semibold">Program Pelatihan</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
                Pilih program pembelajaran untuk meningkatkan skill Anda
            </p>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <USkeleton v-for="i in 3" :key="i" class="h-80 rounded-xl" />
        </div>

        <!-- Error -->
        <UAlert v-else-if="errorMessage" color="error" variant="soft" :title="errorMessage" />

        <!-- Program Cards -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <UCard v-for="video in videoData" :key="video.id" class="overflow-hidden hover:shadow-lg transition">
                <!-- Cover Image -->
                <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200" alt="Program Cover"
                    class="h-40 w-full object-cover" />

                <!-- Content -->
                <div class="p-4 space-y-3">
                    <h3 class="text-lg font-semibold leading-tight">
                        {{ video.name }}
                    </h3>

                </div>
            </UCard>
        </div>
    </div>
</template>
