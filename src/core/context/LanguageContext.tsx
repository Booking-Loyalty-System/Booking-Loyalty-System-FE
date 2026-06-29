import React, { createContext, useContext, useState } from 'react';
import i18n from '@/core/i18n';

type Language = 'en' | 'vi';

interface LanguageContextValue {
    language: Language;
    changeLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    isVietnamese: boolean;
}

const LANG_KEY = 'autowash-lang';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        const stored = localStorage.getItem(LANG_KEY) as Language | null;
        return stored === 'vi' ? 'vi' : 'en';
    });

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem(LANG_KEY, lang);
        i18n.changeLanguage(lang);
    };

    const toggleLanguage = () => {
        changeLanguage(language === 'en' ? 'vi' : 'en');
    };

    return (
        <LanguageContext.Provider value={{
            language,
            changeLanguage,
            toggleLanguage,
            isVietnamese: language === 'vi',
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextValue => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
    return ctx;
};
