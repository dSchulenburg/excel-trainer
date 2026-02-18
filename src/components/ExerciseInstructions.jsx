import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../context/I18nContext';

export default function ExerciseInstructions({ exercise, completedSteps }) {
  const { t } = useI18n();
  const [showHint, setShowHint] = useState(false);
  const [hintIdx, setHintIdx] = useState(0);

  const activeStep = exercise.steps.findIndex((_, i) => !completedSteps.get(i));

  return (
    <div>
      <div className="exercise-sidebar__story">{t(exercise.storyKey)}</div>
      <h3 className="exercise-sidebar__title">{t('exercise.instructions')}</h3>
      <ol className="instructions">
        {exercise.steps.map((stepKey, i) => {
          const done = completedSteps.get(i) === true;
          const active = i === activeStep;
          return (
            <motion.li
              key={i}
              className={`instructions__step ${done ? 'instructions__step--done' : ''} ${active ? 'instructions__step--active' : ''}`}
              initial={false}
              animate={active ? { backgroundColor: 'rgba(232, 244, 253, 1)' } : {}}
            >
              <motion.span
                className={`instructions__check ${done ? 'instructions__check--done' : ''} ${active ? 'instructions__check--active' : ''}`}
                animate={done ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {done ? '✓' : i + 1}
              </motion.span>
              <span>{t(stepKey)}</span>
            </motion.li>
          );
        })}
      </ol>
      {exercise.hints && exercise.hints.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <AnimatePresence mode="wait">
            {!showHint ? (
              <motion.button
                key="toggle"
                className="hint-toggle"
                onClick={() => setShowHint(true)}
                whileHover={{ scale: 1.03, backgroundColor: '#FFFEF0' }}
                whileTap={{ scale: 0.97 }}
              >
                {'💡'} {t('common.hint')}
              </motion.button>
            ) : (
              <motion.div
                key="hint"
                className="hint-box"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p>{'💡'} {t(exercise.hints[hintIdx])}</p>
                {hintIdx < exercise.hints.length - 1 && (
                  <motion.button
                    className="hint-toggle"
                    style={{ marginTop: '0.5rem' }}
                    onClick={() => setHintIdx(hintIdx + 1)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {t('common.next')} {t('common.hint')}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
