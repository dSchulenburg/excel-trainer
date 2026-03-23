import l1ex1 from './level1/ex1-einkaufsliste';
import l1ex2 from './level1/ex2-preise';
import l1ex3 from './level1/ex3-summe';
import l1ex4 from './level1/ex4-budget';
import l2ex1 from './level2/ex1-wochenplan';
import l2ex2 from './level2/ex2-preisvergleich';
import l2ex3 from './level2/ex3-ausgaben';
import l2ex4 from './level2/ex4-mittelwert';
import l3ex1 from './level3/ex1-rezept';
import l3ex2 from './level3/ex2-wochenmenue';
import l3ex3 from './level3/ex3-kalorien';
import l3ex4 from './level3/ex4-rezepteinkauf';
import l4ex1 from './level4/ex1-nebenkosten';
import l4ex2 from './level4/ex2-sparplan';
import l4ex3 from './level4/ex3-rabatt';
import l4ex4 from './level4/ex4-monatsuebersicht';
import l5ex1 from './level5/ex1-reisekosten';
import l5ex2 from './level5/ex2-taschengeld';
import l5ex3 from './level5/ex3-zimmer';
import l5ex4 from './level5/ex4-abrechnung';
import l6ex1 from './level6/ex1-noten';
import l6ex2 from './level6/ex2-gehalt';
import l6ex3 from './level6/ex3-inventur';
import l6ex4 from './level6/ex4-jahresvergleich';
import { kaufleuteExercises, kaufleuteLevels } from './kaufleute/index';

export const exercises = [
  l1ex1, l1ex2, l1ex3, l1ex4,
  l2ex1, l2ex2, l2ex3, l2ex4,
  l3ex1, l3ex2, l3ex3, l3ex4,
  l4ex1, l4ex2, l4ex3, l4ex4,
  l5ex1, l5ex2, l5ex3, l5ex4,
  l6ex1, l6ex2, l6ex3, l6ex4,
  ...kaufleuteExercises,
];

export const levels = [
  {
    id: 1,
    trackId: 'avm',
    titleKey: 'level1.title',
    storyKey: 'level1.story',
    icon: '\u{1F6D2}',
    exercises: exercises.filter((e) => e.levelId === 1 && e.trackId === 'avm'),
  },
  {
    id: 2,
    trackId: 'avm',
    titleKey: 'level2.title',
    storyKey: 'level2.story',
    icon: '\u{1F4C5}',
    exercises: exercises.filter((e) => e.levelId === 2 && e.trackId === 'avm'),
  },
  {
    id: 3,
    trackId: 'avm',
    titleKey: 'level3.title',
    storyKey: 'level3.story',
    icon: '\u{1F373}',
    exercises: exercises.filter((e) => e.levelId === 3 && e.trackId === 'avm'),
  },
  {
    id: 4,
    trackId: 'avm',
    titleKey: 'level4.title',
    storyKey: 'level4.story',
    icon: '\u{1F3E0}',
    exercises: exercises.filter((e) => e.levelId === 4 && e.trackId === 'avm'),
  },
  {
    id: 5,
    trackId: 'avm',
    titleKey: 'level5.title',
    storyKey: 'level5.story',
    icon: '\u{2708}\u{FE0F}',
    exercises: exercises.filter((e) => e.levelId === 5 && e.trackId === 'avm'),
  },
  {
    id: 6,
    trackId: 'avm',
    titleKey: 'level6.title',
    storyKey: 'level6.story',
    icon: '\u{1F4BC}',
    exercises: exercises.filter((e) => e.levelId === 6 && e.trackId === 'avm'),
  },
  ...kaufleuteLevels,
];

export function getExercise(id) {
  return exercises.find((e) => e.id === id) || null;
}

export function getNextExercise(currentId) {
  const current = exercises.find((e) => e.id === currentId);
  if (!current) return null;
  // Only navigate to next exercise within the same track
  const trackExercises = exercises.filter((e) => e.trackId === current.trackId);
  const idx = trackExercises.findIndex((e) => e.id === currentId);
  return idx >= 0 && idx < trackExercises.length - 1 ? trackExercises[idx + 1] : null;
}

export function getExercisesByTrack(trackId) {
  return exercises.filter((e) => e.trackId === trackId);
}

export function getLevelsByTrack(trackId) {
  return levels.filter((l) => l.trackId === trackId);
}
