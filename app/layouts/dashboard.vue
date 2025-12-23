<!-- layouts/dashboard.vue-->
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useAuth } from '~/composables/useAuth'

const { logout } = useAuth()
const collapsed = ref(false)

const handleLogout = async () => {
    try {
        console.log("LOGOUT ");

        await logout()
        navigateTo('/login')
    } catch (error) {
        console.error('Logout failed:', error)
    }
}


const links: NavigationMenuItem[] = [
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
        icon: 'i-heroicons-square-3-stack-3d',
        to: '/dashboard/video'
    },
    {
        label: 'Profile',
        icon: 'i-heroicons-user',
        to: '/dashboard/profile'
    }
]

const items = ref<NavigationMenuItem[]>(
    [
        {
            label: 'User',
            icon: 'i-heroicons-user',
            children: [
                { label: 'Profile', icon: 'i-heroicons-user', to: '/dashboard/profile' },
                { label: 'Logout', icon: 'i-heroicons-arrow-left-on-rectangle', onSelect: (e: Event) => handleLogout }
            ]
        },
    ],
)
</script>

<template>
    <UDashboardGroup>
        <!-- Sidebar -->
        <UDashboardSidebar v-model:collapsed="collapsed" :items="links" collapsible>
            <template #header>
                <div class="h-14 flex items-center justify-center border-b">
                    <span v-if="!collapsed" class="font-semibold text-primary">E‑Learning System</span>
                    <span v-else class="font-bold text-primary">EL</span>
                </div>
            </template>

            <template #default="{ collapsed }">
                <UNavigationMenu :collapsed="collapsed" :items="links" orientation="vertical" />
            </template>
        </UDashboardSidebar>

        <!-- Main Content -->
        <UDashboardPanel>
            <template #header>
                <UDashboardNavbar class="border-b">
                    <template #left>
                        <UButton icon="i-heroicons-bars-3" variant="ghost" color="primary"
                            @click="collapsed = !collapsed" />
                        <span class="text-sm font-semibold">Dashboard</span>
                    </template>

                    <template #right>
                        <UColorModeButton />
                        <UNavigationMenu arrow content-orientation="vertical" :items="items"
                            class="w-48 justify-center" />
                    </template>
                </UDashboardNavbar>
            </template>

            <template #body>
                <div class="min-h-[calc(100vh-3.5rem)] bg-neutral-100 dark:bg-neutral-900 p-6">
                    <slot />
                </div>
            </template>
        </UDashboardPanel>
    </UDashboardGroup>
</template>