<!-- layouts/dashboard.vue-->
<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'
import { useRoute } from 'vue-router'
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()
const collapsed = ref(false)
const showLogoutConfirm = ref(false)

const sidebarMenuItems: NavigationMenuItem[] = [
    {
        label: 'Dashboard',
        icon: 'i-heroicons-home',
        to: '/dashboard'
    },
    {
        label: 'Program',
        icon: 'i-heroicons-academic-cap',
        to: '/dashboard/program'
    },
    {
        label: 'Course',
        icon: 'i-heroicons-square-3-stack-3d',
        to: '/dashboard/course'
    },
    {
        label: 'Video',
        icon: 'i-heroicons-video-camera',
        to: '/dashboard/video'
    },
]

const navbarMenuItems = [[{
    label: 'Profile',
    icon: 'i-lucide-user-round-cog',
}, {
    label: 'Logout',
    icon: 'i-lucide-log-out',
    onSelect() {
        openLogoutConfirm()
    },
}]] satisfies DropdownMenuItem[][]

const handleLogout = async () => {
    try {
        await authStore.logout()
        navigateTo('/login')
        toast.add({
            title: 'Success',
            description: `Logout berhasil.`,
            icon: 'i-lucide-circle-check'
        })
    } catch (error) {
        console.error('Logout failed:', error)
        toast.add({
            title: 'Failed',
            description: `Terjadi error pada server.`,
            icon: 'i-lucide-circle-x'
        })
    }
}

const openLogoutConfirm = () => {
    showLogoutConfirm.value = true
}

const findMenuLabelByPath = (path: string) => {
    return sidebarMenuItems.find(item => item.to === path)?.label
}

const navbarTitle = computed(() => {
    return findMenuLabelByPath(route.path) ?? 'Dashboard'
})

</script>

<template>
    <ClientOnly>
        <UDashboardGroup>
            <!-- Sidebar -->
            <UDashboardSidebar v-model:collapsed="collapsed" :items="sidebarMenuItems" collapsible>
                <template #header>
                    <div class="h-14 flex items-center justify-center border-b">
                        <span v-if="!collapsed" class="font-semibold text-primary">E‑Learning System</span>
                        <span v-else class="font-bold text-primary">EL</span>
                    </div>
                </template>

                <template #default="{ collapsed }">
                    <UNavigationMenu :collapsed="collapsed" :items="sidebarMenuItems" orientation="vertical" />
                </template>
            </UDashboardSidebar>

            <!-- Main Content -->
            <UDashboardPanel>
                <template #header>
                    <UDashboardNavbar :title="navbarTitle">
                        <template #leading>
                            <UDashboardSidebarCollapse />
                        </template>
                        <template #right>
                            <UColorModeButton />
                            <UDropdownMenu :items="navbarMenuItems">
                                <UButton icon="i-lucide-user" size="md" class="rounded-full" />
                            </UDropdownMenu>
                        </template>
                    </UDashboardNavbar>
                </template>

                <template #body>
                    <div>
                        <slot />
                    </div>
                </template>
            </UDashboardPanel>
        </UDashboardGroup>

        <UModal v-model:open="showLogoutConfirm" :dismissible="false" title="Konfirmasi Logout">
            <template #body>
                <p>Apakah Anda yakin ingin keluar dari aplikasi?</p>
            </template>

            <template #footer>
                <div class="flex justify-start gap-2">
                    <UButton color="neutral" variant="soft" @click="showLogoutConfirm = false">
                        Batal
                    </UButton>

                    <UButton color="error" variant="solid" @click="() => {
                        showLogoutConfirm = false
                        handleLogout()
                    }">
                        Logout
                    </UButton>
                </div>
            </template>
        </UModal>
    </ClientOnly>
</template>