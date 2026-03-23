import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider } from './context/GameContext';
import { I18nProvider } from './context/I18nContext';
import { useGame } from './context/GameContext';
import Layout from './components/Layout';
import LevelMap from './components/LevelMap';
import TrackSelect from './components/TrackSelect';
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
  const { selectedTrack, setTrack } = useGame();
  // If no track selected yet, start at trackSelect; otherwise go straight to levels
  const [view, setView] = useState(selectedTrack ? 'levels' : 'trackSelect');
  const [currentExerciseId, setCurrentExerciseId] = useState(null);
  const [storyShown, setStoryShown] = useState(new Set());

  const handleSelectTrack = useCallback(
    (trackId) => {
      setTrack(trackId);
      setView('levels');
    },
    [setTrack]
  );

  const handleStartExercise = useCallback(
    (exerciseId) => {
      setCurrentExerciseId(exerciseId);
      // IDs are like "A-L1-EX1" — the level segment is at index 1
      const parts = exerciseId.split('-');
      const levelId = parts.length >= 2 ? parts[1] : parts[0]; // e.g. "L1"
      // Scope story tracking per track+level to avoid cross-track conflicts
      const storyKey = `${selectedTrack}-${levelId}`;
      if (!storyShown.has(storyKey)) {
        setView('story');
        setStoryShown((prev) => new Set(prev).add(storyKey));
      } else {
        setView('exercise');
      }
    },
    [storyShown, selectedTrack]
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

  const handleNavigate = useCallback(
    (target) => {
      setView(target);
      setCurrentExerciseId(null);
    },
    []
  );

  const exercise = currentExerciseId ? getExercise(currentExerciseId) : null;

  let content;
  switch (view) {
    case 'trackSelect':
      content = <TrackSelect onSelectTrack={handleSelectTrack} />;
      break;
    case 'levels':
      content = <LevelMap track={selectedTrack} onStartExercise={handleStartExercise} />;
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
      content = <LevelMap track={selectedTrack} onStartExercise={handleStartExercise} />;
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
