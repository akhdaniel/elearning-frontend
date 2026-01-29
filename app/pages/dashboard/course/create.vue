<!-- pages/dashboard/course/create.vue -->
<script setup lang="ts">
import type { VitContentPrompt, VitCoursePeriod, ResLang, ResCurrency, VitProgram } from '~/../server/types/odoo'
import { useContentPrompt } from '~/composables/useContentPrompt'
import { useCourse } from '~/composables/useCourse'
import { useCoursePeriod } from '~/composables/useCoursePeriod'
import { useResLang } from '~/composables/useResLang'
import { useResCurrency } from '~/composables/useResCurrency'
import { useProgram } from '~/composables/useProgram'

const { setBreadcrumb, clearBreadcrumb } = useBreadcrumb()
const { getAllContentPrompt } = useContentPrompt()
const { getAllCoursePeriod } = useCoursePeriod()
const { getAllResLang } = useResLang()
const { getAllResCurrency } = useResCurrency()
const { getProgram } = useProgram()
const { createCourse } = useCourse()
const toast = useToast()
definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Create New Course | E-Learning System'
})

const state = reactive({
    name: '',
    description: '',
    active: true,
    list_price: 0,
    is_standalone: false,
    is_optional: false,
    period_id: null,
    program_id: null,
    prompt_id: null,
    summary_prompt_id: null,
    product_fee_id: null,
    currency_id: null,
    lang_id: null,
})

const loading = ref(false)

const { data: contentPromptData, pending: pendingContentPromptData } = useAsyncData('content-prompt', () => getAllContentPrompt(), {
    transform: (res: any) => {
        return res.map((item: VitContentPrompt) => ({
            id: item.id,
            label: item.name,
        }))
    },
    server: true,
})

const { data: coursePeriodData, pending: pendingCoursePeriodData } = useAsyncData('course-period', () => getAllCoursePeriod(), {
    transform: (res: any) => {
        return res.map((item: VitCoursePeriod) => ({
            id: item.id,
            label: item.name,
        }))
    },
    server: true,
})

const { data: resLangData, pending: pendingResLangData } = useAsyncData('res-lang', () => getAllResLang(), {
    transform: (res: any) => {
        return res.map((item: ResLang) => ({
            id: item.id,
            label: item.name,
        }))
    },
    server: true,
})

const { data: resCurrencyData, pending: pendingResCurrencyData } = useAsyncData('res-currency', () => getAllResCurrency(), {
    transform: (res: any) => {
        return res.map((item: ResCurrency) => ({
            id: item.id,
            label: item.name,
        }))
    },
    server: true,
})

const { data: vitProgramData, pending: pendingVitProgramData } = useAsyncData('vit-program', () => getProgram(), {
    transform: (res: any) => {
        return res.map((item: VitProgram) => ({
            id: item.id,
            label: item.name,
        }))
    },
    server: true,
})

onMounted(() => {
    setBreadcrumb([
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Course', to: '/dashboard/course' },
        { label: 'Create' },
    ])
})

onBeforeUnmount(() => {
    clearBreadcrumb()
})

const onCreateCourse = async () => {
    loading.value = true
    try {
        await createCourse(state)
        toast.add({ title: "Success", description: "Course created successfully", color: "success", icon: "i-lucide-check-circle" })
        navigateTo('/dashboard/course/create')
    } catch (error) {
        console.log("error : ", error);
        toast.add({ title: 'Error', description: 'Failed to create course', color: 'error', icon: "i-lucide-triangle-alert" })
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="mx-auto scrollbar-hide">
        <div class="mb-8">
            <h2 class="text-2xl font-bold">Create New Course</h2>
            <p class="text-neutral-500">Fill in the details below to add a new learning module.</p>
        </div>

        <UForm :state="state" class="space-y-6" @submit="onCreateCourse">
            <UCard>
                <template #header>
                    <h3 class="font-semibold">Basic Information</h3>
                </template>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-4">
                        <UFormField label="Course Name" name="name" required>
                            <UInput v-model="state.name" placeholder="e.g. Advanced Vue.js Development"
                                class="w-full" />
                        </UFormField>

                        <UFormField label="Description" name="description">
                            <UTextarea v-model="state.description" placeholder="Write a brief overview of the course..."
                                autoresize class="w-full" />
                        </UFormField>
                    </div>
                </div>
            </UCard>

            <UCard>
                <template #header>
                    <h3 class="font-semibold">Prompt</h3>
                </template>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-4">
                        <UFormField label="Prompt" name="prompt_id">
                            <USelectMenu v-model="state.prompt_id" :items="contentPromptData"
                                :options="contentPromptData || []" :loading="pendingContentPromptData" value-key="id"
                                placeholder="Select AI Prompt" class="w-full" />
                        </UFormField>
                        <UFormField label="Summary Prompt" name="summary_prompt_id">
                            <USelectMenu v-model="state.summary_prompt_id" :items="contentPromptData"
                                :options="contentPromptData || []" :loading="pendingContentPromptData" value-key="id"
                                placeholder="Select Summary Prompt" class="w-full" />
                        </UFormField>
                    </div>
                </div>
            </UCard>

            <UCard>
                <template #header>
                    <h3 class="font-semibold">Other Information</h3>
                </template>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <UFormField label="Program" name="program_id">
                        <USelectMenu v-model="state.program_id" :items="vitProgramData" :options="vitProgramData"
                            :loading="pendingVitProgramData" value-key="id" option-attribute="label"
                            placeholder="Select Program" class="w-full" />
                    </UFormField>
                    <UFormField label="Language" name="lang_id">
                        <USelectMenu v-model="state.lang_id" :items="resLangData" :options="resLangData"
                            :loading="pendingResLangData" value-key="id" option-attribute="label"
                            placeholder="Select Language" class="w-full" />
                    </UFormField>
                    <UFormField label="Period" name="period_id">
                        <USelectMenu v-model="state.period_id" :items="coursePeriodData" :options="coursePeriodData"
                            :loading="pendingCoursePeriodData" value-key="id" option-attribute="label"
                            placeholder="Select Period" class="w-full" />
                    </UFormField>
                    <UFormField label="Currency" name="currency_id">
                        <USelectMenu v-model="state.currency_id" :items="resCurrencyData" :options="resCurrencyData"
                            :loading="pendingResCurrencyData" value-key="id" option-attribute="label"
                            placeholder="Select Currency" class="w-full" />
                    </UFormField>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div
                        class="flex flex-col gap-4 justify-center bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg w-full">
                        <UCheckbox v-model="state.active" label="Course is Active" help="Visible to students" />
                        <UCheckbox v-model="state.is_standalone" label="Standalone Course"
                            help="Does not require prerequisites" />
                        <UCheckbox v-model="state.is_optional" label="Optional" help="Elective course for students" />
                    </div>
                    <UFormField label="Price" name="list_price">
                        <UInput v-model="state.list_price" type="number" icon="i-heroicons-banknotes" class="w-full" />
                    </UFormField>
                </div>
            </UCard>

            <div class="flex justify-end gap-3">
                <UButton color="neutral" variant="ghost" label="Cancel" @click="navigateTo('/dashboard/course')" />
                <UButton type="submit" color="primary" label="Save Course" :loading="loading"
                    class="px-8 cursor-pointer" />
            </div>
        </UForm>
    </div>
</template>