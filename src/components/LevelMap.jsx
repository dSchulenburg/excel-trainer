import { motion } from 'framer-motion';
import { useI18n } from '../context/I18nContext';
import { useGame } from '../context/GameContext';
import { levels, exercises } from '../exercises';

export default function LevelMap({ onStartExercise }) {
  const { t } = useI18n();
  const { exerciseResults, isExerciseUnlocked } = useGame();

  return (
    <div className="level-map">
      <h1 className="level-map__title">{t('levelMap.title')}</h1>
      {levels.map((level, levelIndex) => {
        const levelUnlocked =
          level.id === 1 ||
          levels
            .find((l) => l.id === level.id - 1)
            ?.exercises.every((e) => exerciseResults[e.id]);

        return (
          <motion.div
            key={level.id}
            className="level-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: levelIndex * 0.15, duration: 0.4 }}
          >
            <div className="level-card__header" style={!levelUnlocked ? { opacity: 0.5 } : {}}>
              <span className="level-card__icon">{level.icon}</span>
              <span>
                {t('common.level')} {level.id}: {t(level.titleKey)}
              </span>
            </div>
            <div className="level-card__exercises">
              {level.exercises.map((ex, exIndex) => {
                const result = exerciseResults[ex.id];
                const unlocked = isExerciseUnlocked(ex.id, exercises);
                return (
                  <motion.button
                    key={ex.id}
                    className={`exercise-btn ${result ? 'exercise-btn--completed' : ''} ${!unlocked ? 'exercise-btn--locked' : ''}`}
                    onClick={() => unlocked && onStartExercise(ex.id)}
                    disabled={!unlocked}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: levelIndex * 0.15 + exIndex * 0.08, duration: 0.3 }}
                    whileHover={unlocked ? { scale: 1.05, boxShadow: '0 4px 15px rgba(0,51,102,0.2)' } : {}}
                    whileTap={unlocked ? { scale: 0.95 } : {}}
                  >
                    {unlocked ? (
                      <>
                        <div className="exercise-btn__title">{t(ex.titleKey)}</div>
                        {result?.skipped ? (
                          <div style={{ fontSize: '0.72rem', color: '#aaa', fontStyle: 'italic' }}>
                            {t('exercise.skipped')}
                          </div>
                        ) : result ? (
                          <div className="exercise-btn__stars">
                            {'⭐'.repeat(result.stars)}
                            {'☆'.repeat(3 - result.stars)}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.75rem', color: '#888' }}>
                            {t('levelMap.exercise')} {ex.order}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="exercise-btn__lock">{'🔒'}</div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
