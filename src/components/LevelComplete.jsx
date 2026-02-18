import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useI18n } from '../context/I18nContext';
import { useGame } from '../context/GameContext';
import { getNextExercise } from '../exercises';
import { fireConfetti, fireStarConfetti } from '../utils/confetti';
import XPPopup from './ui/XPPopup';

export default function LevelComplete({ exercise, stars, xp, onNext, onBack }) {
  const { t } = useI18n();
  const [showXP] = useState(true);
  const [celebrationData, setCelebrationData] = useState(null);
  const nextEx = getNextExercise(exercise.id);

  useEffect(() => {
    if (stars === 3) fireStarConfetti();
    else fireConfetti();
  }, [stars]);

  useEffect(() => {
    fetch('/excel-trainer/animations/celebration.json')
      .then((r) => r.ok ? r.json() : null)
      .then(setCelebrationData)
      .catch(() => {});
  }, []);

  return (
    <motion.div
      className="level-complete"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      {showXP && <XPPopup xp={xp} />}

      {celebrationData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
        >
          <Lottie
            animationData={celebrationData}
            loop={false}
            style={{ width: 150, height: 150, margin: '0 auto -1rem' }}
          />
        </motion.div>
      )}

      <div className="level-complete__stars">
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + i * 0.2, type: 'spring', stiffness: 200 }}
            style={{ display: 'inline-block' }}
          >
            {i < stars ? '⭐' : '☆'}
          </motion.span>
        ))}
      </div>

      <motion.h2
        className="level-complete__title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {t('complete.title')}
      </motion.h2>

      <motion.div
        className="level-complete__xp"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
      >
        {t('complete.xpEarned', { xp })}
      </motion.div>

      <motion.div
        className="level-complete__actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <motion.button
          className="btn btn--secondary"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('complete.backToMap')}
        </motion.button>
        {nextEx && (
          <motion.button
            className="btn btn--primary"
            onClick={() => onNext(nextEx.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('complete.nextExercise')} {'→'}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
