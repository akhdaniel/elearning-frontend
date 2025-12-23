<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
    layout: 'auth'
})

const auth = useAuthStore()
const errorMessage = ref('')

const state = reactive({
    email: '',
    password: ''
})

const onSubmit = async () => {
    errorMessage.value = ''
    try {
        await auth.login(state.email, state.password)
        await navigateTo('/dashboard')
    } catch (error: any) {
        errorMessage.value =
            error?.data?.statusMessage || 'Email atau password tidak valid'
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-linear-to-br 
           from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <UPageCard class="w-full max-w-md overflow-hidden">
            <!-- Header / Branding -->
            <div class="text-center py-6 px-4 bg-indigo-600 dark:bg-indigo-500 text-white">
                <UIcon name="i-lucide-graduation-cap" class="size-12 mx-auto mb-2" />
                <h1 class="text-xl font-semibold">E-Learning System</h1>
                <p class="text-sm opacity-90">
                    Learning Management Platform
                </p>
            </div>

            <!-- Form -->
            <div class="p-6">
                <h2 class="text-lg font-semibold text-center mb-1">
                    Masuk ke Akun Anda
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                    Gunakan email dan password yang terdaftar
                </p>

                <UForm class="space-y-4" @submit.prevent="onSubmit">
                    <UFormField label="Email" name="email">
                        <UInput v-model="state.email" type="email" placeholder="bootcamp@vitraining.com"
                            icon="i-lucide-mail" required />
                    </UFormField>

                    <UFormField label="Password" name="password">
                        <UInput v-model="state.password" type="password" placeholder="••••••••" icon="i-lucide-lock"
                            required />
                    </UFormField>

                    <UAlert v-if="errorMessage" color="error" variant="soft" :title="errorMessage" />

                    <UButton type="submit" size="lg" block color="primary" :loading="auth.loading">
                        Masuk
                    </UButton>
                </UForm>

                <!-- Footer -->
                <div class="mt-6 text-center text-xs text-gray-400">
                    © {{ new Date().getFullYear() }} E-Learning System
                </div>
            </div>
        </UPageCard>
    </div>
</template>
