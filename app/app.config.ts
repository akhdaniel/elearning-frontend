// app.config.ts
// export default defineAppConfig({
//     ui: {
//         colors: {
//             primary: 'blue',
//             neutral: 'zinc',
//             secondary: 'stone'
//         },
//         dashboardPanel: {
//             slots: {
//                 body: 'bg-neutral-50 dark:bg-neutral-900'
//             }
//         }
//     }
// })

// app.config.ts
export default defineAppConfig({
    ui: {
        colors: {
            primary: 'indigo',
            neutral: 'slate',
        },
        dashboardSidebar: {
            slots: {
                body: 'border-r border-neutral-200/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl',
                header: 'py-5 px-6 border-b border-transparent'
            }
        },
        dashboardPanel: {
            slots: {
                body: 'bg-neutral-50 dark:bg-neutral-900'
            }
        },
        navigationMenu: {
            slots: {
                active: 'text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-950/30 before:bg-primary-600',
                label: 'font-medium text-[14px]',
                icon: {
                    base: 'flex-shrink-0 size-5 transition-transform duration-200 group-hover:scale-110'
                }
            }
        }
    }
})
