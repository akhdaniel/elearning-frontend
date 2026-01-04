export default defineAppConfig({
    ui: {
        colors: {
            primary: 'blue',
            neutral: 'zinc',
            secondary: 'stone'
        },
        dashboardPanel: {
            slots: {
                body: 'bg-neutral-50 dark:bg-neutral-900'
            }
        }
    }
})
