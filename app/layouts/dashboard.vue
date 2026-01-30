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
            <UDashboardSidebar v-model:collapsed="collapsed" :items="sidebarMenuItems" collapsible
                class="transition-all duration-300">
                <!-- <template #header>
                    <div class="flex items-center gap-3 px-2 py-6 overflow-hidden">
                        <div
                            class="flex items-center justify-center p-2 rounded-xl bg-linear-to-br from-primary-500 to-indigo-600 shadow-lg shadow-primary-500/20">
                            <UIcon name="i-lucide-graduation-cap" class="size-6 text-white" />
                        </div>
                        <Transition enter-active-class="transition duration-200 ease-out"
                            enter-from-class="opacity-0 -translate-x-4" enter-to-class="opacity-100 translate-x-0">
                            <div v-if="!collapsed" class="flex flex-col">
                                <span
                                    class="text-sm font-bold tracking-tight text-neutral-900 dark:text-white leading-none">
                                    EDUGEN
                                </span>
                                <span class="text-[10px] font-medium text-primary-500 uppercase tracking-widest mt-1">
                                    AI Course Gen
                                </span>
                            </div>
                        </Transition>
                    </div>
                </template> -->

                <template #default="{ collapsed }">
                    <div class="flex items-center gap-3 px-2 py-4 overflow-hidden">
                        <div
                            class="flex items-center justify-center p-2 rounded-xl bg-linear-to-br from-primary-500 to-indigo-600 shadow-lg shadow-primary-500/20">
                            <UIcon name="i-lucide-graduation-cap" class="size-6 text-white" />
                        </div>
                        <Transition enter-active-class="transition duration-200 ease-out"
                            enter-from-class="opacity-0 -translate-x-4" enter-to-class="opacity-100 translate-x-0">
                            <div v-if="!collapsed" class="flex flex-col">
                                <span
                                    class="text-sm font-bold tracking-tight text-neutral-900 dark:text-white leading-none">
                                    EDUGEN
                                </span>
                                <span class="text-[10px] font-medium text-primary-500 uppercase tracking-widest mt-1">
                                    AI Course Gen
                                </span>
                            </div>
                        </Transition>
                    </div>
                    <div class="flex flex-col gap-8 mt-4">
                        <div>
                            <p v-if="!collapsed"
                                class="px-4 mb-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                                General
                            </p>
                            <UNavigationMenu :collapsed="collapsed" :items="sidebarMenuItems" orientation="vertical"
                                class="px-2" />
                        </div>

                        <div v-if="!collapsed" class="px-4">
                            <div
                                class="p-4 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-700/50">
                                <p class="text-xs font-medium text-neutral-600 dark:text-neutral-400">Gen-AI Credits</p>
                                <div
                                    class="mt-2 h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                    <div class="h-full bg-primary-500 w-[70%]" />
                                </div>
                                <p class="mt-2 text-[10px] text-neutral-500">70 / 100 courses left</p>
                            </div>
                        </div>
                    </div>
                </template>

                <template #footer v-if="!collapsed">
                    <div class="p-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
                        <div class="flex items-center gap-3">
                            <UAvatar src="https://avatars.githubusercontent.com/u/1?v=4" size="sm" />
                            <div class="flex flex-col min-w-0">
                                <p class="text-xs font-semibold truncate">{{ authStore.user?.name }}</p>
                                <p class="text-[10px] text-neutral-500 truncate">Pro Plan</p>
                            </div>
                        </div>
                    </div>
                </template>
            </UDashboardSidebar>

            <UDashboardPanel>
                <template #header>
                    <UDashboardNavbar :title="navbarTitle"
                        class="backdrop-blur-md bg-white/60 dark:bg-neutral-900/60 border-b border-neutral-200/50 dark:border-neutral-800/50">
                        <template #leading>
                            <UDashboardSidebarCollapse class="lg:hidden" />
                        </template>
                        <template #right>
                            <div class="flex items-center gap-2">
                                <UButton icon="i-lucide-bell" color="neutral" variant="ghost" class="rounded-full" />
                                <UColorModeButton />
                                <div class="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />
                                <UDropdownMenu :items="navbarMenuItems" :content="{ align: 'end' }">
                                    <UButton variant="ghost" color="neutral"
                                        class="p-0.5 rounded-full hover:bg-transparent">
                                        <UAvatar size="sm" class="border-2 border-primary-500/20" />
                                    </UButton>
                                </UDropdownMenu>
                            </div>
                        </template>
                    </UDashboardNavbar>

                    <UDashboardToolbar class="px-6 py-3 bg-neutral-50/30 dark:bg-neutral-900/30">
                        <UBreadcrumb :items="resolvedBreadcrumbs">
                            <template #separator>
                                <UIcon name="i-lucide-chevron-right" class="size-3 text-neutral-400" />
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

        <UModal v-model:open="showLogoutConfirm" title="Sign Out">
        </UModal>
    </ClientOnly>
</template>