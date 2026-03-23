import kl1ex1 from './level1/ex1-mwst';
import kl1ex2 from './level1/ex2-waehrung';
import kl1ex3 from './level1/ex3-rabattstaffel';
import kl1ex4 from './level1/ex4-provision';
import kl3ex1 from './level3/ex1-kundenstatus';
import kl3ex2 from './level3/ex2-expressversand';
import kl3ex3 from './level3/ex3-rabattklasse';
import kl3ex4 from './level3/ex4-lieferantenbewertung';
// Levels 2, 4-8 will be added in later tasks

export const kaufleuteExercises = [
  kl1ex1, kl1ex2, kl1ex3, kl1ex4,
  kl3ex1, kl3ex2, kl3ex3, kl3ex4,
];

export const kaufleuteLevels = [
  {
    id: 1,
    trackId: 'kaufleute',
    titleKey: 'kaufleute.level1.title',
    storyKey: 'kaufleute.level1.story',
    icon: '\u{1F4CC}',
    exercises: kaufleuteExercises.filter((e) => e.levelId === 1),
  },
  {
    id: 3,
    trackId: 'kaufleute',
    titleKey: 'kaufleute.level3.title',
    storyKey: 'kaufleute.level3.story',
    icon: '\u{1F4CA}',
    exercises: kaufleuteExercises.filter((e) => e.levelId === 3),
  },
  // Levels 2, 4-8 will be added in later tasks
];
