export default defineAppConfig({
    ui: {
        colors: {
            primary: 'blue',
            neutral: 'slate'
        },
        dashboardPanel: {
            slots: {
                body: 'flex flex-col gap-4 sm:gap-6 flex-1 overflow-y-auto'
            }
        }
    }
})
