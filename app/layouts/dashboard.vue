<!-- layouts/dashboard.vue-->
<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'
import type { BreadcrumbItem } from '@nuxt/ui'
import { useBreadcrumb } from '~/composables/useBreadcrumb'
import { useRoute } from 'vue-router'
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()
const { breadcrumbs } = useBreadcrumb()
const collapsed = ref(false)
const showLogoutConfirm = ref(false)

const sidebarMenuItems: NavigationMenuItem[] = [
    {
        label: 'Dashboard',
        icon: 'i-lucide-house',
        to: '/dashboard',
        meta: { title: 'Dashboard' }
    },
    {
        label: 'Program',
        icon: 'i-lucide-folder-closed',
        to: '/dashboard/program'
    },
    {
        label: 'Course',
        icon: 'i-lucide-package-check',
        to: '/dashboard/course'
    },
    {
        label: 'Video',
        icon: 'i-lucide-video',
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

const resolvedBreadcrumbs = computed<BreadcrumbItem[]>(() => {
    return breadcrumbs.value?.length
        ? breadcrumbs.value
        : [{ label: navbarTitle.value }]
})

</script>

<template>
    <ClientOnly>
        <UDashboardGroup>
            <!-- Sidebar -->
            <UDashboardSidebar v-model:collapsed="collapsed" :items="sidebarMenuItems" collapsible>
                <template #header>
                    <div class="flex flex-col items-center w-full gap-3">
                        <!-- Icon + Title -->
                        <div class="flex items-center justify-center w-full">
                            <UIcon name="i-lucide-graduation-cap" class="size-6 text-primary" />
                            <span v-if="!collapsed" class="font-semibold text-primary ml-2">
                                E‑Learning System
                            </span>
                        </div>

                        <!-- Separator -->
                        <USeparator class="w-full" :ui="{ border: 'border-primary/30' }" />
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
                    <UDashboardToolbar>
                        <UBreadcrumb :items="resolvedBreadcrumbs">
                            <template #separator>
                                <span class="mx-2 text-muted">/</span>
                            </template>
                        </UBreadcrumb>
                    </UDashboardToolbar>
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