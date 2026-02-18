import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider } from './context/GameContext';
import { I18nProvider } from './context/I18nContext';
import Layout from './components/Layout';
import LevelMap from './components/LevelMap';
import ExerciseView from './components/ExerciseView';
import StoryIntro from './components/StoryIntro';
import BadgeWall from './components/BadgeWall';
import Glossary from './components/Glossary';
import ProfileCard from './components/ProfileCard';
import { getExercise } from './exercises';
import './App.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function AppContent() {
  const [view, setView] = useState('levels'); // levels, badges, glossary, profile, story, exercise
  const [currentExerciseId, setCurrentExerciseId] = useState(null);
  const [storyShown, setStoryShown] = useState(new Set());

  const handleStartExercise = useCallback(
    (exerciseId) => {
      setCurrentExerciseId(exerciseId);
      const levelId = exerciseId.split('-')[0]; // e.g. "L1"
      if (!storyShown.has(levelId)) {
        setView('story');
        setStoryShown((prev) => new Set(prev).add(levelId));
      } else {
        setView('exercise');
      }
    },
    [storyShown]
  );

  const handleStoryStart = useCallback(() => {
    setView('exercise');
  }, []);

  const handleBack = useCallback(() => {
    setView('levels');
    setCurrentExerciseId(null);
  }, []);

  const handleNextExercise = useCallback((nextId) => {
    setCurrentExerciseId(nextId);
    setView('exercise');
  }, []);

  const handleNavigate = useCallback((target) => {
    setView(target);
    setCurrentExerciseId(null);
  }, []);

  const exercise = currentExerciseId ? getExercise(currentExerciseId) : null;

  let content;
  switch (view) {
    case 'levels':
      content = <LevelMap onStartExercise={handleStartExercise} />;
      break;
    case 'story':
      content = <StoryIntro exerciseId={currentExerciseId} onStart={handleStoryStart} />;
      break;
    case 'exercise':
      content = exercise ? (
        <ExerciseView
          key={exercise.id}
          exercise={exercise}
          onBack={handleBack}
          onNextExercise={handleNextExercise}
        />
      ) : null;
      break;
    case 'badges':
      content = <BadgeWall />;
      break;
    case 'glossary':
      content = <Glossary />;
      break;
    case 'profile':
      content = <ProfileCard />;
      break;
    default:
      content = <LevelMap onStartExercise={handleStartExercise} />;
  }

  return (
    <Layout currentView={view} onNavigate={handleNavigate}>
      <AnimatePresence mode="wait">
        <motion.div
          key={view + (currentExerciseId || '')}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25 }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </I18nProvider>
  );
}
