import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enCustomer from './locales/en/customer.json';
import viCommon from './locales/vi/common.json';
import viCustomer from './locales/vi/customer.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                common: enCommon,
                customer: enCustomer,
            },
            vi: {
                common: viCommon,
                customer: viCustomer,
            },
        },
        lng: localStorage.getItem('autowash-lang') || 'en',
        fallbackLng: 'en',
        defaultNS: 'common',
        ns: ['common', 'customer'],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            // Tắt auto-detect từ browser, dùng localStorage của mình
            order: [],
        },
    });

export default i18n;
