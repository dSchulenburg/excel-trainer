import { useI18n, LANGUAGES } from '../../context/I18nContext';
import { useGame } from '../../context/GameContext';

export default function LanguagePicker() {
  const { lang, setLang } = useI18n();
  const { notifyLanguageChange } = useGame();

  const handleChange = (code) => {
    if (code !== lang) {
      setLang(code);
      notifyLanguageChange();
    }
  };

  return (
    <div className="lang-picker">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          className={`lang-picker__btn ${lang === l.code ? 'lang-picker__btn--active' : ''}`}
          onClick={() => handleChange(l.code)}
          title={l.label}
        >
          {l.flag}
        </button>
      ))}
    </div>
  );
}
