<script setup lang="ts">
import type { VitProgram } from '~/../server/types/odoo'
import { useProgram } from '~/composables/useProgram'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'E-Learning System | Program'
})

const { getAllProgram } = useProgram()

const programData = ref<VitProgram[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const page = ref(1)
const perPage = 9
const total = ref(0)

const getAllPrograms = async () => {
    isLoading.value = true
    try {
        const res = await getAllProgram({
            page: page.value,
            limit: perPage
        })
        programData.value = res.records
        total.value = res.total
    } catch (error) {
        errorMessage.value = 'Koneksi ke server gagal. Coba lagi nanti.'
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    getAllPrograms()
})

watch([page], () => {
    page.value = page.value < 1 ? 1 : page.value
    getAllPrograms()
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
            <UCard v-for="program in programData" :key="program.id" class="overflow-hidden hover:shadow-lg transition"
                :ui="{ body: 'p-0 sm:p-0' }">
                <!-- Cover Image -->
                <div class="relative overflow-hidden rounded-t-lg h-48">
                    <img :src="getCoverImage(program.cover_image2)" alt="Program Cover"
                        class="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                </div>

                <!-- Content -->
                <div class="space-y-3 p-4">
                    <h3 class="text-lg font-semibold leading-tight">
                        {{ program.name }}
                    </h3>

                    <p class="text-xs text-gray-500">
                        Instructor:
                        <span class="font-medium text-gray-700 dark:text-gray-300">
                            {{ program.instructor_id.display_name }}
                        </span>
                    </p>

                    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3" v-html="program.description" />

                    <!-- Price -->
                    <div class="flex items-center justify-between pt-2">
                        <div>
                            <p class="text-xs text-gray-500">Price</p>
                            <p class="font-semibold text-indigo-600 dark:text-indigo-400">
                                {{ formatCurrency(program.onetime_price) }}
                            </p>
                        </div>

                        <UButton size="sm" color="primary" variant="soft">
                            Detail
                        </UButton>
                    </div>
                </div>
            </UCard>
        </div>

        <!-- Pagination -->
        <div v-if="total > perPage" class="flex justify-center pt-4">
            <UPagination v-model:page="page" :items-per-page="perPage" :total="total" size="sm" />
        </div>
    </div>
</template>
