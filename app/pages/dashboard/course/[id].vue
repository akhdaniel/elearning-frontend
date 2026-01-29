<script setup lang="ts">
import type { VitContentPrompt, VitCoursePeriod, ResLang, ResCurrency, VitProgram, VitCourse } from '~/../server/types/odoo'
import { useContentPrompt } from '~/composables/useContentPrompt'
import { useCourse } from '~/composables/useCourse'
import { useCoursePeriod } from '~/composables/useCoursePeriod'
import { useResLang } from '~/composables/useResLang'
import { useResCurrency } from '~/composables/useResCurrency'
import { useProgram } from '~/composables/useProgram'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const { setBreadcrumb, clearBreadcrumb } = useBreadcrumb()
const { getAllContentPrompt } = useContentPrompt()
const { getAllCoursePeriod } = useCoursePeriod()
const { getAllResLang } = useResLang()
const { getAllResCurrency } = useResCurrency()
const { getProgram } = useProgram()
const { getCourseById, updateCourse } = useCourse()
const toast = useToast()

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Edit Course | E-Learning System'
})

const state = reactive({
    name: '',
    description: '',
    active: true,
    list_price: 0,
    is_standalone: false,
    is_optional: false,
    topics: '',
    period_id: null,
    program_id: null,
    prompt_id: null,
    summary_prompt_id: null,
    currency_id: null,
    lang_id: null,
})

const loading = ref(false)
const fetching = ref(true)
const topicsData = ref<any[]>([])

const fetchCourseDetail = async () => {
    try {
        fetching.value = true
        const res: VitCourse = await getCourseById(Number(id))
        if (res) {
            console.log("res : ", res);

            Object.assign(state, {
                name: res.name,
                description: res.description || '',
                active: res.active,
                list_price: res.list_price,
                is_standalone: res.is_standalone,
                is_optional: res.is_optional,
                topics: res.topics,
                period_id: res.period_id && typeof res.period_id === 'object' ? (res.period_id as any).id : null,
                program_id: res.program_id && typeof res.program_id === 'object' ? (res.program_id as any).id : null,
                prompt_id: res.prompt_id && typeof res.prompt_id === 'object' ? (res.prompt_id as any).id : null,
                summary_prompt_id: res.summary_prompt_id && typeof res.summary_prompt_id === 'object' ? (res.summary_prompt_id as any).id : null,
                currency_id: res.currency_id && typeof res.currency_id === 'object' ? (res.currency_id as any).id : null,
                lang_id: res.lang_id && typeof res.lang_id === 'object' ? (res.lang_id as any).id : null,
            })
            topicsData.value = res.topic_ids || []
        }
    } catch (error) {
        toast.add({ title: 'Error', description: 'Failed to load course data', color: 'error', icon: "i-lucide-triangle-alert" })
    } finally {
        fetching.value = false
    }
}

const getItems = (videos: any[]) => {
    return videos.map(v => ({
        label: v.name,
        icon: 'i-lucide-play-circle',
        id: v.id
    }))
}

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

onMounted(async () => {
    await fetchCourseDetail()
    setBreadcrumb([
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Course', to: '/dashboard/course' },
        { label: `${state.name || id}` },
    ])
})

onBeforeUnmount(() => {
    clearBreadcrumb()
})

const onUpdateCourse = async () => {
    loading.value = true
    try {
        await updateCourse(id, state)
        toast.add({ title: "Updated", description: "Course updated successfully", color: "success", icon: "i-lucide-check-circle" })
    } catch (error) {
        toast.add({ title: 'Error', description: 'Update failed', color: 'error' })
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="mx-auto scrollbar-hide">
        <div class="mb-8 flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold">Edit Course</h2>
                <p class="text-neutral-500">Modify the course details and save changes.</p>
            </div>
            <UButton icon="i-lucide-arrow-left" variant="ghost" @click="router.back()">Back</UButton>
        </div>

        <div v-if="fetching" class="space-y-4">
            <USkeleton class="h-12 w-full" />
            <USkeleton class="h-64 w-full" />
        </div>

        <UForm v-else :state="state" class="space-y-6" @submit="onUpdateCourse">
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-1 space-y-6">
                    <UCard>
                        <template #header>
                            <h3 class="font-semibold">Basic Information</h3>
                        </template>
                        <div class="grid gap-4">
                            <div class="space-y-4">
                                <UFormField label="Course Name" name="name" required>
                                    <UInput v-model="state.name" class="w-full" />
                                </UFormField>
                                <UFormField label="Description" name="description">
                                    <UTextarea v-model="state.description" autoresize class="w-full" />
                                </UFormField>
                            </div>
                        </div>
                    </UCard>

                    <UCard>
                        <template #header>
                            <h3 class="font-semibold">Prompt</h3>
                        </template>
                        <div class="grid gap-4">
                            <div class="space-y-4">
                                <UFormField label="Prompt" name="prompt_id">
                                    <USelectMenu v-model="state.prompt_id" :items="contentPromptData"
                                        :loading="pendingContentPromptData" :options="contentPromptData" value-key="id"
                                        class="w-full" />
                                </UFormField>
                                <UFormField label="Summary Prompt" name="summary_prompt_id">
                                    <USelectMenu v-model="state.summary_prompt_id" :items="contentPromptData"
                                        :loading="pendingContentPromptData" :options="contentPromptData" value-key="id"
                                        class="w-full" />
                                </UFormField>
                            </div>
                        </div>
                    </UCard>

                    <UCard>
                        <template #header>
                            <h3 class="font-semibold">Other Information</h3>
                        </template>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <UFormField label="Program" name="program_id">
                                <USelectMenu v-model="state.program_id" :items="vitProgramData"
                                    :options="vitProgramData" :loading="pendingVitProgramData" value-key="id"
                                    option-attribute="label" placeholder="Select Program" class="w-full" />
                            </UFormField>
                            <UFormField label="Language" name="lang_id">
                                <USelectMenu v-model="state.lang_id" :items="resLangData" :options="resLangData"
                                    :loading="pendingResLangData" value-key="id" option-attribute="label"
                                    placeholder="Select Language" class="w-full" />
                            </UFormField>
                            <UFormField label="Period" name="period_id">
                                <USelectMenu v-model="state.period_id" :items="coursePeriodData"
                                    :options="coursePeriodData" :loading="pendingCoursePeriodData" value-key="id"
                                    option-attribute="label" placeholder="Select Period" class="w-full" />
                            </UFormField>
                            <UFormField label="Currency" name="currency_id">
                                <USelectMenu v-model="state.currency_id" :items="resCurrencyData"
                                    :options="resCurrencyData" :loading="pendingResCurrencyData" value-key="id"
                                    option-attribute="label" placeholder="Select Currency" class="w-full" />
                            </UFormField>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div class="flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                                <UCheckbox v-model="state.active" label="Course is Active" />
                                <UCheckbox v-model="state.is_standalone" label="Standalone" />
                            </div>
                            <UFormField label="Price" name="list_price">
                                <UInput v-model="state.list_price" type="number" icon="i-heroicons-banknotes" />
                            </UFormField>
                        </div>
                    </UCard>
                </div>

                <div class="w-full md:w-1/2 flex flex-col">
                    <UCard class="flex-1 flex flex-col">
                        <template #header>
                            <h3 class="font-semibold">Draft Topic</h3>
                        </template>

                        <div class="h-full min-h-100 flex flex-col">
                            <UFormField label="Topics" name="topics" class="h-full flex flex-col"
                                :ui="{ container: 'flex-1 flex flex-col' }">
                                <UTextarea v-model="state.topics" placeholder="Topics draft will be generated here..."
                                    class="flex-1 w-full" :rows="30" variant="outline"
                                    :ui="{ base: 'h-full resize-none' }" />
                            </UFormField>
                        </div>
                    </UCard>
                </div>
            </div>

            <div class="flex justify-end gap-3">
                <UButton color="neutral" variant="ghost" label="Cancel" @click="navigateTo('/dashboard/course')" />
                <UButton type="submit" color="primary" label="Update Changes" :loading="loading" class="px-8" />
            </div>

            <div class="space-y-6">
                <UCard>
                    <template #header>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <UIcon name="i-lucide-layers" class="w-5 h-5 text-primary" />
                                <h3 class="font-semibold text-lg">Course Curriculum</h3>
                            </div>
                            <UBadge variant="soft" color="primary">{{ topicsData.length }} Topics</UBadge>
                        </div>
                    </template>

                    <div v-if="topicsData.length === 0" class="py-10 text-center">
                        <UIcon name="i-lucide-book-open" class="w-12 h-12 mx-auto text-neutral-400 mb-2" />
                        <p class="text-neutral-500">No topics found for this course.</p>
                    </div>

                    <div v-else class="space-y-4">
                        <UAccordion :items="topicsData.map(topic => ({
                            label: topic.name,
                            slot: 'content',
                            description: `${topic.video_ids?.length || 0} Videos`,
                            videos: topic.video_ids
                        }))" multiple variant="ghost">
                            <template #default="{ item, open }">
                                <UButton color="neutral" variant="ghost"
                                    class="border-b border-neutral-100 dark:border-neutral-800 py-4 px-2 hover:bg-gray-800 w-full">
                                    <template #leading>
                                        <div class="bg-neutral-800 text-primary p-1.5 rounded-md">
                                            <UIcon name="i-lucide-folder-closed" v-if="!open" />
                                            <UIcon name="i-lucide-folder-open" v-else />
                                        </div>
                                    </template>

                                    <div class="text-left flex-1">
                                        <p class="font-medium text-neutral-900 dark:text-white">{{ item.label }}</p>
                                        <p class="text-xs text-neutral-500">{{ item.description }}</p>
                                    </div>

                                    <template #trailing>
                                        <UIcon name="i-heroicons-chevron-right-20-solid"
                                            class="w-5 h-5 transform transition-transform duration-200"
                                            :class="[open && 'rotate-90']" />
                                    </template>
                                </UButton>
                            </template>

                            <template #content="{ item }">
                                <div class="pl-12 pr-4 pb-4 space-y-2">
                                    <div v-for="video in item.videos" :key="video.id"
                                        class="group flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-neutral-200 hover:bg-white dark:hover:bg-neutral-900 transition-all">
                                        <div class="flex items-center gap-3">
                                            <UIcon name="i-lucide-play-circle"
                                                class="text-neutral-400 group-hover:text-primary transition-colors" />
                                            <span
                                                class="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white">
                                                {{ video.name }}
                                            </span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <UBadge size="xs" variant="subtle" color="neutral">ID: {{ video.id }}
                                            </UBadge>
                                            <UButton icon="i-lucide-pencil" size="xs" variant="ghost" color="neutral" />
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </UAccordion>
                    </div>
                </UCard>
            </div>
        </UForm>
    </div>
</template>