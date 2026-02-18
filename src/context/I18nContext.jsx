import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import de from '../i18n/de.json';
import uk from '../i18n/uk.json';

const translations = { de, uk };
const RTL_LANGUAGES = ['ar', 'fa'];

export const LANGUAGES = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
];

const I18nContext = createContext();

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('excel-trainer-lang');
    return saved && translations[saved] ? saved : 'de';
  });

  const isRTL = RTL_LANGUAGES.includes(lang);

  useEffect(() => {
    localStorage.setItem('excel-trainer-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [lang, isRTL]);

  const t = useCallback(
    (key, params) => {
      const dict = translations[lang] || translations.de;
      let val = getNestedValue(dict, key);
      if (val === null) val = getNestedValue(translations.de, key);
      if (val === null) return key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          val = val.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        });
      }
      return val;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
