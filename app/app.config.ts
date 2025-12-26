export default defineAppConfig({
    ui: {
        colors: {
            primary: 'blue',
            neutral: 'slate'
        },
        dashboardPanel: {
            slots: {
                body: 'bg-neutral-100 dark:bg-neutral-800'
            }
        }
    }
})
