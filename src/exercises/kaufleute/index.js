import kl1ex1 from './level1/ex1-mwst';
import kl1ex2 from './level1/ex2-waehrung';
import kl1ex3 from './level1/ex3-rabattstaffel';
import kl1ex4 from './level1/ex4-provision';
import kl2ex1 from './level2/ex1-zahlungsziel';
import kl2ex2 from './level2/ex2-skonto';
import kl2ex3 from './level2/ex3-lagerampel';
import kl2ex4 from './level2/ex4-versandkosten';
import kl3ex1 from './level3/ex1-kundenstatus';
import kl3ex2 from './level3/ex2-expressversand';
import kl3ex3 from './level3/ex3-rabattklasse';
import kl3ex4 from './level3/ex4-lieferantenbewertung';
import kl4ex1 from './level4/ex1-artikelpreis';
import kl4ex2 from './level4/ex2-lieferant';
import kl4ex3 from './level4/ex3-rechnung';
import kl4ex4 from './level4/ex4-lagerort';
import kl5ex1 from './level5/ex1-besterpreis';
import kl5ex2 from './level5/ex2-bestellvorschlag';
import kl5ex3 from './level5/ex3-kundenrechnung';
import kl5ex4 from './level5/ex4-fehlererkennung';
import kl6ex1 from './level6/ex1-umsatz-kategorie';
import kl6ex2 from './level6/ex2-bestellungen';
import kl6ex3 from './level6/ex3-filialvergleich';
import kl6ex4 from './level6/ex4-topkunden';
// Levels 7-8 will be added in later tasks

export const kaufleuteExercises = [
  kl1ex1, kl1ex2, kl1ex3, kl1ex4,
  kl2ex1, kl2ex2, kl2ex3, kl2ex4,
  kl3ex1, kl3ex2, kl3ex3, kl3ex4,
  kl4ex1, kl4ex2, kl4ex3, kl4ex4,
  kl5ex1, kl5ex2, kl5ex3, kl5ex4,
  kl6ex1, kl6ex2, kl6ex3, kl6ex4,
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
    id: 2,
    trackId: 'kaufleute',
    titleKey: 'kaufleute.level2.title',
    storyKey: 'kaufleute.level2.story',
    icon: '\u{1F500}',
    exercises: kaufleuteExercises.filter((e) => e.levelId === 2),
  },
  {
    id: 3,
    trackId: 'kaufleute',
    titleKey: 'kaufleute.level3.title',
    storyKey: 'kaufleute.level3.story',
    icon: '\u{1F4CA}',
    exercises: kaufleuteExercises.filter((e) => e.levelId === 3),
  },
  {
    id: 4,
    trackId: 'kaufleute',
    titleKey: 'kaufleute.level4.title',
    storyKey: 'kaufleute.level4.story',
    icon: '\u{1F50D}',
    exercises: kaufleuteExercises.filter((e) => e.levelId === 4),
  },
  {
    id: 5,
    trackId: 'kaufleute',
    titleKey: 'kaufleute.level5.title',
    storyKey: 'kaufleute.level5.story',
    icon: '\u{1F3C6}',
    exercises: kaufleuteExercises.filter((e) => e.levelId === 5),
  },
  {
    id: 6,
    trackId: 'kaufleute',
    titleKey: 'kaufleute.level6.title',
    storyKey: 'kaufleute.level6.story',
    icon: '\u{1F4CA}',
    exercises: kaufleuteExercises.filter((e) => e.levelId === 6),
  },
  // Levels 7-8 will be added in later tasks
];
