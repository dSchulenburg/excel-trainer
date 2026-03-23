import { useState, useCallback, useRef } from 'react';
import { useI18n } from '../context/I18nContext';
import { useGame } from '../context/GameContext';
import { validateExercise, getCompletedSteps } from '../utils/validation';
import { calculateExerciseXP, calculateStars } from '../utils/xp';
import ExerciseInstructions from './ExerciseInstructions';
import SpreadsheetArea from './SpreadsheetArea';
import ValidationFeedback from './ValidationFeedback';
import LevelComplete from './LevelComplete';
import AudioPlayer from './AudioPlayer';

export default function ExerciseView({ exercise, onBack, onNextExercise }) {
  const { t } = useI18n();
  const { completeExercise, skipExercise } = useGame();
  const [sheetData, setSheetData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Map());
  const [showComplete, setShowComplete] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [stars, setStars] = useState(0);
  const startTime = useRef(Date.now());
  const totalErrors = useRef(0);

  const handleDataChange = useCallback(
    (data) => {
      setSheetData(data);
      const steps = getCompletedSteps(exercise.validations, data);
      setCompletedSteps(steps);
    },
    [exercise]
  );

  const handleCheck = useCallback(() => {
    if (!sheetData) return;
    const result = validateExercise(exercise.validations, sheetData);
    setValidationResult(result);
    setCompletedSteps(getCompletedSteps(exercise.validations, sheetData));

    if (result.passed) {
      const seconds = Math.floor((Date.now() - startTime.current) / 1000);
      const xp = calculateExerciseXP(exercise, totalErrors.current, seconds);
      const s = calculateStars(totalErrors.current);
      setEarnedXP(xp);
      setStars(s);
      completeExercise(exercise.id, totalErrors.current, seconds, exercise);
      setShowComplete(true);
    } else {
      totalErrors.current += result.errors;
    }
  }, [sheetData, exercise, completeExercise]);

  const handleSkip = useCallback(() => {
    skipExercise(exercise.id);
    onBack();
  }, [exercise.id, skipExercise, onBack]);

  if (showComplete) {
    return (
      <LevelComplete
        exercise={exercise}
        stars={stars}
        xp={earnedXP}
        onNext={onNextExercise}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="exercise-view">
      <div className="exercise-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="btn btn--secondary" onClick={onBack} style={{ padding: '0.3rem 0.6rem' }}>
            {'←'} {t('common.back')}
          </button>
          <h2 className="exercise-sidebar__title">{t(exercise.titleKey)}</h2>
          <AudioPlayer
            src={`level${exercise.levelId}-${exercise.id.split('-')[1].toLowerCase()}`}
            label={t('audio.exerciseIntro')}
            compact
          />
        </div>
        <ExerciseInstructions exercise={exercise} completedSteps={completedSteps} />
      </div>
      <div className="exercise-view__sheet">
        <div style={{ flex: 1, minHeight: 0 }}>
          <SpreadsheetArea exercise={exercise} onDataChange={handleDataChange} />
        </div>
        <ValidationFeedback
          validationResult={validationResult}
          onCheck={handleCheck}
          onSkip={handleSkip}
          allDone={validationResult?.passed}
        />
      </div>
    </div>
  );
}
