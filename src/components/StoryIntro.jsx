import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useI18n } from '../context/I18nContext';
import { levels } from '../exercises';

const STORY_ANIMATIONS = {
  1: '/excel-trainer/animations/shopping.json',
  2: '/excel-trainer/animations/calendar.json',
  3: '/excel-trainer/animations/cooking.json',
  4: '/excel-trainer/animations/apartment.json',
  5: '/excel-trainer/animations/travel.json',
  6: '/excel-trainer/animations/business.json',
};

export default function StoryIntro({ exerciseId, onStart }) {
  const { t } = useI18n();
  const levelId = parseInt(exerciseId.split('-')[0].replace('L', ''));
  const level = levels.find((l) => l.id === levelId);
  const [animData, setAnimData] = useState(null);

  useEffect(() => {
    const url = STORY_ANIMATIONS[levelId];
    if (!url) return;
    fetch(url)
      .then((r) => r.ok ? r.json() : null)
      .then(setAnimData)
      .catch(() => {});
  }, [levelId]);

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
        {t(`level${levelId}.title`)}
      </motion.h2>
      <motion.p
        className="story-intro__text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {t(`level${levelId}.story`)}
      </motion.p>
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
