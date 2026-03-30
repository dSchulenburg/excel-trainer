import { motion } from 'framer-motion';
import { useI18n } from '../context/I18nContext';
import { useGame } from '../context/GameContext';
import { getPlayerLevel, getXPProgress } from '../utils/xp';
import ProgressBar from './ui/ProgressBar';
import LanguagePicker from './ui/LanguagePicker';

const TRACK_ICONS = { avm: '🛒', kaufleute: '📊' };

export default function Layout({ children, currentView, onNavigate }) {
  const { t } = useI18n();
  const { xp, streak, selectedTrack } = useGame();
  const playerLevel = getPlayerLevel(xp, selectedTrack);
  const xpProgress = getXPProgress(xp, selectedTrack);

  const navItems = [
    { key: 'levels', label: t('nav.levels') },
    { key: 'badges', label: t('nav.badges') },
    { key: 'glossary', label: t('nav.glossary') },
    { key: 'profile', label: t('nav.profile') },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <div className="app-header__title">{t('app.title')}</div>
          <div className="app-header__subtitle">{t('app.subtitle')}</div>
        </div>
        {selectedTrack && currentView !== 'trackSelect' && (
          <motion.button
            className="app-header__track-btn"
            onClick={() => onNavigate('trackSelect')}
            title={t('trackSelect.title')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{TRACK_ICONS[selectedTrack] || '📚'}</span>
            <span className="app-header__track-name">
              {t(`trackSelect.${selectedTrack}.title`)}
            </span>
          </motion.button>
        )}
        <div className="app-header__spacer" />
        <div className="app-header__xp">
          <span>{xp} XP</span>
          <ProgressBar value={xpProgress} />
          <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{t(playerLevel.titleKey)}</span>
        </div>
        {streak.count > 0 && (
          <div className="app-header__streak">
            {'🔥'} {streak.count} {streak.count === 1 ? t('common.day') : t('common.days')}
          </div>
        )}
        <LanguagePicker />
        <nav className="app-header__nav">
          {navItems.map((item) => (
            <motion.button
              key={item.key}
              className={`app-header__nav-btn ${currentView === item.key ? 'app-header__nav-btn--active' : ''}`}
              onClick={() => onNavigate(item.key)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
