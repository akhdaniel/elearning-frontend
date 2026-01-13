// composables/useBreadcrumb.ts
import type { BreadcrumbItem } from '@nuxt/ui'

export const useBreadcrumb = () => {
    const breadcrumbs = useState<BreadcrumbItem[] | null>('breadcrumbs', () => null)

    const setBreadcrumb = (items: BreadcrumbItem[]) => {
        breadcrumbs.value = items
    }

    const clearBreadcrumb = () => {
        breadcrumbs.value = null
    }

    return { breadcrumbs, setBreadcrumb, clearBreadcrumb }
}
