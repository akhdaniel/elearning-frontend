<!-- components/VideoComponent -->
<script setup lang="ts">
import type { VitVideo, VitAudioVoice, VitContentPrompt } from '~/../server/types/odoo'
import { useAudioVoice } from '~/composables/useAudioVoice'
import { useContentPrompt } from '~/composables/useContentPrompt'
const props = defineProps<{
    video: VitVideo
}>()

const toast = useToast()
const emit = defineEmits(['updated'])
const { getAllAudioVoice } = useAudioVoice()
const { getAllContentPrompt } = useContentPrompt()
const isLoadingAudio = ref(false)
const isLoadingContentPrompt = ref(false)
const dataAudioVoice = ref<VitAudioVoice[]>([])
const dataContentPrompt = ref<VitContentPrompt[]>([])
const videoState = reactive<{
    id: number | undefined,
    name: string,
    description: string,
    audio_voice_id: number | undefined,
    prompt_id: number | undefined,
}>({
    id: undefined,
    name: '',
    description: '',
    audio_voice_id: undefined,
    prompt_id: undefined,
})

watch(() => props.video, (newVideo) => {
    if (newVideo) {
        videoState.id = newVideo.id
        videoState.name = newVideo.name || ''
        videoState.description = newVideo.description || ''
        videoState.audio_voice_id = newVideo.audio_voice_id || undefined
        videoState.prompt_id = newVideo.prompt_id || undefined
    }
})

const getAudio = async () => {
    isLoadingAudio.value = true
    try {
        const response = await getAllAudioVoice()
        if (response) {
            dataAudioVoice.value = response
        }
    } catch (error) {
        toast.add({ title: 'Error', description: 'Failed to load audio voice data', color: 'error', icon: "i-lucide-triangle-alert" })
    } finally {
        isLoadingAudio.value = false
    }
}

const getContentPrompt = async () => {
    isLoadingContentPrompt.value = true
    try {
        const response = await getAllContentPrompt()
        if (response) {
            dataContentPrompt.value = response
        }
    } catch (error) {
        toast.add({ title: 'Error', description: 'Failed to load prompt data', color: 'error', icon: "i-lucide-triangle-alert" })
    } finally {
        isLoadingContentPrompt.value = false
    }
}

const audioOptions = computed(() => {
    return dataAudioVoice.value.map(item => ({
        label: String(item.name),
        value: item.id
    }))
})

const promptOptions = computed(() => {
    return dataContentPrompt.value.map(item => ({
        label: String(item.name),
        value: item.id
    }))
})

onMounted(async () => {
    await getAudio()
    await getContentPrompt()
})
</script>

<template>
    <UCard>
        <template #header>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-layers" class="w-5 h-5 text-primary" />
                    <h3 class="font-semibold text-lg">
                        Video {{ video?.name ? `: ${video.name}` : '' }}
                    </h3>
                </div>
            </div>
        </template>

        <div v-if="video" class="grid gap-4">
            <div class="space-y-4">
                <UFormField label="Video Name" name="name" required>
                    <UInput v-model="videoState.name" class="w-full" />
                </UFormField>
                <UFormField label="Description" name="description">
                    <UTextarea v-model="videoState.description" autoresize class="w-full"
                        placeholder="Description of the video ..." />
                </UFormField>
                <UFormField label="Prompt" name="prompt_id">
                    <USelectMenu v-model="videoState.prompt_id" :items="promptOptions" :loading="isLoadingContentPrompt"
                        :options="promptOptions" value-key="value" class="w-full" />
                </UFormField>
                <UFormField label="Audio Voice" name="audio_voice_id">
                    <USelectMenu v-model="videoState.audio_voice_id" :items="audioOptions" :loading="isLoadingAudio"
                        :options="audioOptions" value-key="value" class="w-full" />
                </UFormField>
            </div>
            <div class="flex justify-end space-y-6">
                <UButton v-if="video" color="primary" label="Update Video" class="px-8 cursor-pointer" />
            </div>
        </div>

        <div v-else class="py-10 text-center text-neutral-500">
            <UIcon name="i-lucide-mouse-pointer-2" class="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>Select a video from the list to see details</p>
        </div>
    </UCard>
</template>