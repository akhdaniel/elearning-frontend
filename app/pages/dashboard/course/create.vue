<script setup lang="ts">
const { setBreadcrumb, clearBreadcrumb } = useBreadcrumb()
const toast = useToast()
definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Create New Course | E-Learning System'
})

// Initialize form state
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

// Mock options (Anda bisa menggantinya dengan fetching dari API)
const programs = ref([{ id: 1, label: 'Fullstack Developer' }, { id: 2, label: 'Data Science' }])
const periods = ref([{ id: 1, label: '2024 Semester 1' }, { id: 2, label: '2024 Semester 2' }])
const languages = ref([{ id: 1, label: 'Indonesian' }, { id: 2, label: 'English' }])
const currencies = ref([{ id: 1, label: 'IDR' }, { id: 2, label: 'USD' }])

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

const onSubmit = async () => {
    loading.value = true
    try {
        // Implementasi integrasi API Anda di sini
        console.log('Submitting data:', state)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulasi network
        toast.add({ title: "Success", description: "Course created successfully", color: "success", icon: "i-lucide-check-circle" })
        navigateTo('/dashboard/course')
    } catch (error) {
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

        <UForm :state="state" class="space-y-6" @submit="onSubmit">
            <UCard>
                <template #header>
                    <h3 class="font-semibold">Basic Information</h3>
                </template>

                <div class="space-y-4">
                    <UFormField label="Course Name" name="name" required>
                        <UInput v-model="state.name" placeholder="e.g. Advanced Vue.js Development"
                            class="w-full md:w-1/2" />
                    </UFormField>

                    <UFormField label="Description" name="description">
                        <UTextarea v-model="state.description" placeholder="Write a brief overview of the course..."
                            autoresize class="w-full md:w-1/2" />
                    </UFormField>
                </div>
            </UCard>

            <UCard>
                <template #header>
                    <h3 class="font-semibold">Prompt</h3>
                </template>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <UFormField label="Prompt" name="prompt_id">
                            <USelectMenu v-model="state.prompt_id" :options="[]" placeholder="Select AI Prompt"
                                class="w-full" />
                        </UFormField>
                        <UFormField label="Summary Prompt" name="prompt_id">
                            <USelectMenu v-model="state.prompt_id" :options="[]" placeholder="Select AI Prompt"
                                class="w-full" />
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
                        <USelectMenu v-model="state.program_id" :options="programs" option-attribute="label"
                            placeholder="Select Program" class="w-full" />
                    </UFormField>
                    <UFormField label="Language" name="lang_id">
                        <USelectMenu v-model="state.lang_id" :options="languages" option-attribute="label"
                            placeholder="Select Language" class="w-full" />
                    </UFormField>
                    <UFormField label="Period" name="period_id">
                        <USelectMenu v-model="state.period_id" :options="periods" option-attribute="label"
                            placeholder="Select Period" class="w-full" />
                    </UFormField>
                    <UFormField label="Currency" name="currency_id">
                        <USelectMenu v-model="state.currency_id" :options="currencies" option-attribute="label"
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
                <UButton type="submit" color="primary" label="Save Course" :loading="loading" class="px-8" />
            </div>
        </UForm>
    </div>
</template>