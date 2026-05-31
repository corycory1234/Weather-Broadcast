import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhTW from './locales/zh-TW/translation.json';
import en from './locales/en/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-TW': { translation: zhTW },
      en: { translation: en },
    },
    lng: 'zh-TW',        // 預設語系
    fallbackLng: 'en',   // 找不到 key 時的備用語系
    interpolation: {
      escapeValue: false, // React 本身已防 XSS
    },
  });

export default i18n;