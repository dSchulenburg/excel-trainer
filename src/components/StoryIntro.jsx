import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useI18n } from '../context/I18nContext';
import { getExercise, levels } from '../exercises';
import AudioPlayer from './AudioPlayer';

// Keyed by track — the AVM Lotties (shopping cart, cooking pot, plane …)
// belong to the "Erste eigene Wohnung" story and must not leak into the
// Kaufleute track. Levels without an entry fall back to the level icon.
const STORY_ANIMATIONS = {
  avm: {
    1: 'animations/shopping.json',
    2: 'animations/calendar.json',
    3: 'animations/cooking.json',
    4: 'animations/apartment.json',
    5: 'animations/travel.json',
    6: 'animations/business.json',
  },
  kaufleute: {
    1: 'animations/business.json',
    8: 'animations/celebration.json',
  },
};

export default function StoryIntro({ exerciseId, onStart }) {
  const { t } = useI18n();
  const exercise = getExercise(exerciseId);
  const levelId = exercise?.levelId || 1;
  const trackId = exercise?.trackId || 'avm';
  const level = levels.find((l) => l.id === levelId && l.trackId === trackId);
  const [animData, setAnimData] = useState(null);

  useEffect(() => {
    setAnimData(null);
    const path = STORY_ANIMATIONS[trackId]?.[levelId];
    if (!path) return;
    fetch(`${import.meta.env.BASE_URL}${path}`)
      .then((r) => r.ok ? r.json() : null)
      .then(setAnimData)
      .catch(() => {});
  }, [levelId, trackId]);

  return (
    <motion.div
      className="story-intro"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
    >
      {animData ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Lottie animationData={animData} loop style={{ width: 180, height: 180, margin: '0 auto' }} />
        </motion.div>
      ) : (
        <motion.div
          className="story-intro__icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
        >
          {level?.icon || '📊'}
        </motion.div>
      )}
      <motion.h2
        className="story-intro__title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {level ? t(level.titleKey) : `Level ${levelId}`}
      </motion.h2>
      <motion.p
        className="story-intro__text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {level ? t(level.storyKey) : ''}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        style={{ marginBottom: '0.5rem' }}
      >
        <AudioPlayer
          src={
            // AVM keeps its historical filenames; other tracks get a prefix so
            // they never play AVM narrations (player hides while file missing)
            trackId === 'avm' ? `level${levelId}-intro` : `${trackId}-level${levelId}-intro`
          }
          label={t('audio.levelIntro')}
        />
      </motion.div>
      <motion.button
        className="btn btn--primary"
        onClick={onStart}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t('common.start')} {'→'}
      </motion.button>
    </motion.div>
  );
}
