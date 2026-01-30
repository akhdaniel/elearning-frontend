<!-- components/TopicComponent -->
<script setup lang="ts">
import { useTopic } from '~/composables/useTopic'
const props = defineProps<{
    topic: any | null,
}>()

const emit = defineEmits(['updated'])

const { updateTopic } = useTopic()
const toast = useToast()
const loading = ref(false)

const topicState = reactive({
    id: null,
    name: '',
    description: '',
    survey_id: null,
    quiz_prompt_id: null,
})

watch(() => props.topic, (newTopic) => {
    if (newTopic) {
        topicState.id = newTopic.id
        topicState.name = newTopic.name
        topicState.description = newTopic.description || ''
        topicState.survey_id = newTopic.survey_id || null
        topicState.quiz_prompt_id = newTopic.quiz_prompt_id || null
    }
}, { immediate: true, deep: true })

const onUpdateTopic = async () => {
    if (!props.topic?.id) return

    loading.value = true
    try {
        const payload = {
            name: topicState.name,
            description: topicState.description
        }
        const response = await updateTopic(props.topic.id, payload)
        if (response.success) {
            toast.add({
                title: 'Success', description: 'Topic updated successfully', color: 'success', icon: 'i-lucide-check-circle'
            })
            emit('updated')
        }
    } catch (error) {
        toast.add({ title: 'Error', description: 'Failed to update topic', color: 'error', icon: 'i-lucide-triangle-alert' })
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <UCard>
        <template #header>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-layers" class="w-5 h-5 text-primary" />
                    <h3 class="font-semibold text-lg">
                        Topic {{ topic?.name ? `: ${topic.name}` : '' }}
                    </h3>
                </div>

            </div>
        </template>

        <div v-if="topic" class="grid gap-4">
            <div class="space-y-4">
                <UFormField label="Topic Name" name="name" required>
                    <UInput v-model="topicState.name" class="w-full" />
                </UFormField>
                <UFormField label="Description" name="description">
                    <UTextarea v-model="topicState.description" autoresize class="w-full" />
                </UFormField>
            </div>
            <div class="flex justify-end space-y-6">
                <UButton v-if="topic" color="primary" label="Update Topic" @click="onUpdateTopic"
                    class="px-8 cursor-pointer" />
            </div>
        </div>

        <div v-else class="py-10 text-center text-neutral-500">
            <UIcon name="i-lucide-mouse-pointer-2" class="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>Select a topic from the list to see details</p>
        </div>
    </UCard>
</template>