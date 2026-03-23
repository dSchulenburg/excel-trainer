import { motion } from 'framer-motion';
import { useI18n } from '../context/I18nContext';

const TRACKS = [
  {
    id: 'avm',
    icon: '🛒',
    levels: 6,
    exercises: 24,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'kaufleute',
    icon: '📊',
    levels: 8,
    exercises: 32,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function TrackSelect({ onSelectTrack }) {
  const { t } = useI18n();

  return (
    <div className="track-select">
      <h1 className="track-select__title">{t('trackSelect.title')}</h1>
      <motion.div
        className="track-select__cards"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {TRACKS.map((track) => (
          <motion.button
            key={track.id}
            className="track-card"
            style={{ background: track.gradient }}
            variants={cardVariants}
            whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectTrack(track.id)}
          >
            <div className="track-card__icon">{track.icon}</div>
            <div className="track-card__title">{t(`trackSelect.${track.id}.title`)}</div>
            <div className="track-card__desc">{t(`trackSelect.${track.id}.desc`)}</div>
            <div className="track-card__meta">
              {track.levels} {t('common.level')} &middot; {track.exercises} {t('levelMap.exercise')}en
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
