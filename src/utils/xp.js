export const PLAYER_LEVELS = [
  { level: 1, title: 'Anfaenger', titleKey: 'playerLevel.avm.1', xpRequired: 0 },
  { level: 2, title: 'Entdecker', titleKey: 'playerLevel.avm.2', xpRequired: 100 },
  { level: 3, title: 'Tabellenkenner', titleKey: 'playerLevel.avm.3', xpRequired: 300 },
  { level: 4, title: 'Formelprofi', titleKey: 'playerLevel.avm.4', xpRequired: 600 },
  { level: 5, title: 'Excel-Held', titleKey: 'playerLevel.avm.5', xpRequired: 1000 },
];

export const KAUFLEUTE_LEVELS = [
  { level: 1, titleKey: 'playerLevel.kaufleute.1', xpRequired: 0 },
  { level: 2, titleKey: 'playerLevel.kaufleute.2', xpRequired: 150 },
  { level: 3, titleKey: 'playerLevel.kaufleute.3', xpRequired: 400 },
  { level: 4, titleKey: 'playerLevel.kaufleute.4', xpRequired: 800 },
  { level: 5, titleKey: 'playerLevel.kaufleute.5', xpRequired: 1400 },
];

export const PLAYER_LEVELS_BY_TRACK = {
  avm: PLAYER_LEVELS,
  kaufleute: KAUFLEUTE_LEVELS,
};

function getLevelsForTrack(track) {
  return PLAYER_LEVELS_BY_TRACK[track] || PLAYER_LEVELS;
}

export function getPlayerLevel(xp, track = 'avm') {
  const levels = getLevelsForTrack(track);
  let current = levels[0];
  for (const pl of levels) {
    if (xp >= pl.xpRequired) current = pl;
    else break;
  }
  return current;
}

export function getNextLevel(xp, track = 'avm') {
  const levels = getLevelsForTrack(track);
  for (const pl of levels) {
    if (xp < pl.xpRequired) return pl;
  }
  return null;
}

export function getXPProgress(xp, track = 'avm') {
  const current = getPlayerLevel(xp, track);
  const next = getNextLevel(xp, track);
  if (!next) return 1;
  const range = next.xpRequired - current.xpRequired;
  const progress = xp - current.xpRequired;
  return progress / range;
}

export function calculateExerciseXP(exercise, errors, timeSeconds) {
  let xp = exercise.xp.base;
  if (errors === 0) xp += exercise.xp.bonus;
  return xp;
}

export function calculateStars(errors) {
  if (errors === 0) return 3;
  if (errors <= 2) return 2;
  return 1;
}
