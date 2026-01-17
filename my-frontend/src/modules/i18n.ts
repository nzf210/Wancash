import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'

// Type-define 'en' as the master schema
type MessageSchema = typeof en

const i18n = createI18n<[MessageSchema], 'en'>({
    legacy: false, // Use Composition API
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en
    }
})

export default i18n
