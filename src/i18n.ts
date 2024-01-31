import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next)
  .use(Backend)
  .init({
    fallbackLng: 'ru',
    debug: false,
    react: {
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'mark', 'b', 'u'],
    },
  })

export default i18n
