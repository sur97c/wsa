// components/language-selector/LanguageSelector.tsx

import { useLanguage } from '@hooks/useLanguage'
import { useTranslations } from '@hooks/useTranslations'

export function LanguageSelector() {
    const { language, changeLanguage } = useLanguage();
    const { t, translations } = useTranslations()

    return (
        <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="form-select text-sm"
        >
            <option value="es">{t(translations.userMenu.spanishLanguage)}</option>
            <option value="en">{t(translations.userMenu.englishLanguage)}</option>
        </select>
    );
}