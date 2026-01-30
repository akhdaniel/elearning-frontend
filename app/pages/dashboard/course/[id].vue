<!-- pages/dashboard/course/[id].vue -->
<script setup lang="ts">
import type { VitContentPrompt, VitCoursePeriod, ResLang, ResCurrency, VitProgram, VitCourse, VitVideo } from '~/../server/types/odoo'
import { useContentPrompt } from '~/composables/useContentPrompt'
import { useCourse } from '~/composables/useCourse'
import { useCoursePeriod } from '~/composables/useCoursePeriod'
import { useResLang } from '~/composables/useResLang'
import { useResCurrency } from '~/composables/useResCurrency'
import { useProgram } from '~/composables/useProgram'
import TopicComponent from '~/components/TopicComponent.vue'
import VideoComponent from '~/components/VideoComponent.vue'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const { setBreadcrumb, clearBreadcrumb } = useBreadcrumb()
const { getAllContentPrompt } = useContentPrompt()
const { getAllCoursePeriod } = useCoursePeriod()
const { getAllResLang } = useResLang()
const { getAllResCurrency } = useResCurrency()
const { getProgram } = useProgram()
const { getCourseById, updateCourse, generateTopics, regenerateSummary, createContent } = useCourse()
const toast = useToast()

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Edit Course | E-Learning System'
})

const courseState = reactive({
    name: '',
    description: '',
    active: true,
    list_price: 0,
    is_standalone: false,
    is_optional: false,
    topics: '',
    summary: '',
    period_id: null,
    program_id: null,
    prompt_id: null,
    summary_prompt_id: null,
    currency_id: null,
    lang_id: null,
})

const loading = ref(false)
const isGeneratingTopic = ref(false)
const isCreatingContent = ref(false)
const isRegeneratingSummary = ref(false)
const fetching = ref(true)
const selectedTopic = ref<any>(null)
const selectedVideo = ref<VitVideo | null>(null)
const topicsData = ref<any[]>([])

const getCourse = async (isSilent = false) => {
    try {
        if (!isSilent) fetching.value = true
        const res: VitCourse = await getCourseById(Number(id))
        if (res) {
            console.log("getCourseById : ", res);

            Object.assign(courseState, {
                name: res.name,
                description: res.description || '',
                active: res.active,
                list_price: res.list_price,
                is_standalone: res.is_standalone,
                is_optional: res.is_optional,
                topics: res.topics || '',
                summary: res.summary || '',
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
    await getCourse()
    setBreadcrumb([
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Course', to: '/dashboard/course' },
        { label: `${courseState.name || id}` },
    ])
})

onBeforeUnmount(() => {
    clearBreadcrumb()
})

const onUpdateCourse = async () => {
    loading.value = true
    try {
        await updateCourse(id, courseState)
        toast.add({ title: "Updated", description: "Course updated successfully", color: "success", icon: "i-lucide-check-circle" })
    } catch (error) {
        toast.add({ title: 'Error', description: 'Update failed', color: 'error' })
    } finally {
        loading.value = false
    }
}

const onGenerateTopic = async () => {
    isGeneratingTopic.value = true
    try {
        const response: any = await generateTopics(id)
        if (response.success) {
            await getCourse(true)
        }
        toast.add({ title: "Success", description: "Topics generated successfully", color: "success", icon: "i-lucide-check-circle" })
    } catch (error) {
        toast.add({ title: 'Error', description: 'Topics failed to generated', color: 'error', icon: "i-lucide-triangle-alert" })
    } finally {
        isGeneratingTopic.value = false
    }
}

const onRegenerateSummary = async () => {
    isRegeneratingSummary.value = true
    try {
        const response: any = await regenerateSummary(id)
        if (response.success) {
            await getCourse(true)
        }
        toast.add({ title: "Success", description: "Summary generated successfully", color: "success", icon: "i-lucide-check-circle" })
    } catch (error) {
        toast.add({ title: 'Error', description: 'Summary failed to generated', color: 'error', icon: "i-lucide-triangle-alert" })
    } finally {
        isRegeneratingSummary.value = false
    }
}

const onCreateContent = async () => {
    isCreatingContent.value = true
    try {
        const response: any = await createContent(id)
        if (response.success) {
            await getCourse(true)
        }
        toast.add({ title: "Success", description: "Content created successfully", color: "success", icon: "i-lucide-check-circle" })
    } catch (error) {
        toast.add({ title: 'Error', description: 'Content failed to created', color: 'error', icon: "i-lucide-triangle-alert" })
    } finally {
        isCreatingContent.value = false
    }
}

const onTopicClick = (topic: any) => {
    selectedTopic.value = topic
}

const onVideoClick = (video: any) => {
    console.log("onVideoClick : ", video);

    selectedVideo.value = video
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
            <USkeleton class="h-12 w-1/2" />
            <USkeleton class="h-64 w-1/2" />
        </div>

        <UForm v-else :state="courseState" class="space-y-6" @submit="onUpdateCourse">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div class="space-y-6">
                    <UCard>
                        <template #header>
                            <h3 class="font-semibold">Course Information</h3>
                        </template>
                        <div class="grid gap-4">
                            <div class="space-y-4">
                                <UFormField label="Course Name" name="name" required>
                                    <UInput v-model="courseState.name" class="w-full" />
                                </UFormField>
                                <UFormField label="Description" name="description">
                                    <UTextarea v-model="courseState.description" autoresize class="w-full" />
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
                                    <USelectMenu v-model="courseState.prompt_id" :items="contentPromptData"
                                        :loading="pendingContentPromptData" :options="contentPromptData" value-key="id"
                                        class="w-full" />
                                </UFormField>
                                <UFormField label="Summary Prompt" name="summary_prompt_id">
                                    <USelectMenu v-model="courseState.summary_prompt_id" :items="contentPromptData"
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
                                <USelectMenu v-model="courseState.program_id" :items="vitProgramData"
                                    :options="vitProgramData" :loading="pendingVitProgramData" value-key="id"
                                    option-attribute="label" placeholder="Select Program" class="w-full" />
                            </UFormField>
                            <UFormField label="Language" name="lang_id">
                                <USelectMenu v-model="courseState.lang_id" :items="resLangData" :options="resLangData"
                                    :loading="pendingResLangData" value-key="id" option-attribute="label"
                                    placeholder="Select Language" class="w-full" />
                            </UFormField>
                            <UFormField label="Period" name="period_id">
                                <USelectMenu v-model="courseState.period_id" :items="coursePeriodData"
                                    :options="coursePeriodData" :loading="pendingCoursePeriodData" value-key="id"
                                    option-attribute="label" placeholder="Select Period" class="w-full" />
                            </UFormField>
                            <UFormField label="Currency" name="currency_id">
                                <USelectMenu v-model="courseState.currency_id" :items="resCurrencyData"
                                    :options="resCurrencyData" :loading="pendingResCurrencyData" value-key="id"
                                    option-attribute="label" placeholder="Select Currency" class="w-full" />
                            </UFormField>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div class="flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                                <UCheckbox v-model="courseState.active" label="Course is Active" />
                                <UCheckbox v-model="courseState.is_standalone" label="Standalone" />
                            </div>
                            <UFormField label="Price" name="list_price">
                                <UInput v-model="courseState.list_price" type="number" icon="i-heroicons-banknotes" />
                            </UFormField>
                        </div>
                    </UCard>
                </div>

                <div class="h-full">
                    <UCard class="h-full">
                        <template #header>
                            <h3 class="font-semibold">Draft Topic</h3>
                        </template>

                        <div class="space-y-4">
                            <UButton type="button" color="primary" label="Generate Topic" :loading="isGeneratingTopic"
                                class="px-8 cursor-pointer" @click="onGenerateTopic" />
                        </div>

                        <div class="h-full mt-4 relative min-h-100">
                            <div v-if="isGeneratingTopic"
                                class="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-black/20 rounded-lg">
                                <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
                            </div>

                            <UFormField label="Topics" name="topics" class="h-full">
                                <UTextarea v-model="courseState.topics"
                                    placeholder="Topics draft will be generated here..." class="flex-1 w-full"
                                    :rows="20" variant="outline" :ui="{ base: 'h-full resize-none' }" />
                            </UFormField>
                        </div>

                        <div class="space-y-4 mt-6">
                            <UButton type="button" color="primary" label="Regenerate Summary"
                                :loading="isRegeneratingSummary" class="px-8 cursor-pointer"
                                @click="onRegenerateSummary" />
                        </div>

                        <div class="h-full mt-4 relative min-h-100">
                            <div v-if="isRegeneratingSummary"
                                class="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-black/20 rounded-lg">
                                <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
                            </div>
                            <UFormField label="Summary" name="summary" class="h-full">
                                <UTextarea v-model="courseState.summary" placeholder="Summary will be generated here..."
                                    class="flex-1 w-full" :rows="20" variant="outline"
                                    :ui="{ base: 'h-full resize-none' }" />
                            </UFormField>
                        </div>
                    </UCard>
                </div>
            </div>

            <div class="flex justify-end gap-3">
                <UButton color="neutral" variant="ghost" label="Cancel" @click="navigateTo('/dashboard/course')" />
                <UButton type="submit" color="primary" label="Update Changes" :loading="loading"
                    class="px-8 cursor-pointer" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UCard>
                    <template #header>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <UIcon name="i-lucide-layers" class="w-5 h-5 text-primary" />
                                <h3 class="font-semibold text-lg">Course Content</h3>
                            </div>
                            <UBadge variant="soft" color="primary">{{ topicsData.length }} Topics</UBadge>
                        </div>
                    </template>

                    <div v-if="topicsData.length === 0" class="py-10 text-center">
                        <UIcon name="i-lucide-book-open" class="w-12 h-12 mx-auto text-neutral-400 mb-2" />
                        <p class="text-neutral-500">No content found for this course.</p>
                        <div class="mt-4">
                            <UButton type="button" color="primary" label="Create Content" :loading="isCreatingContent"
                                class="px-8 cursor-pointer" @click="onCreateContent" />
                        </div>
                    </div>

                    <div v-else class="space-y-4">
                        <UAccordion :items="topicsData.map(topic => ({
                            label: topic.name,
                            slot: 'content',
                            description: `${topic.video_ids?.length || 0} Videos`,
                            videos: topic.video_ids,
                            rawTopic: topic
                        }))" multiple variant="ghost">
                            <template #default="{ item, open }">
                                <UButton color="neutral" variant="ghost" @click="onTopicClick(item.rawTopic)"
                                    class="dark:border-neutral-800 py-4 px-2 hover:bg-gray-800 w-full cursor-pointer">
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
                                </UButton>
                            </template>

                            <template #content="{ item }">
                                <div class="pl-12 pr-4 pb-4 space-y-2">
                                    <div v-for="video in item.videos" :key="video.id"
                                        class="group flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-neutral-600 hover:bg-white dark:hover:bg-neutral-800 transition-all cursor-pointer"
                                        @click="onVideoClick(video)">
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
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </UAccordion>
                    </div>
                </UCard>
                <div class="space-y-6">
                    <TopicComponent :topic="selectedTopic" @updated="getCourse(true)" />
                    <VideoComponent v-if="selectedVideo" :video="selectedVideo" />
                </div>
            </div>
        </UForm>
    </div>
</template>