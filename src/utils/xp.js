export const PLAYER_LEVELS = [
  { level: 1, title: 'Anfaenger', titleKey: 'playerLevel.1', xpRequired: 0 },
  { level: 2, title: 'Entdecker', titleKey: 'playerLevel.2', xpRequired: 100 },
  { level: 3, title: 'Tabellenkenner', titleKey: 'playerLevel.3', xpRequired: 300 },
  { level: 4, title: 'Formelprofi', titleKey: 'playerLevel.4', xpRequired: 600 },
  { level: 5, title: 'Excel-Held', titleKey: 'playerLevel.5', xpRequired: 1000 },
];

export function getPlayerLevel(xp) {
  let current = PLAYER_LEVELS[0];
  for (const pl of PLAYER_LEVELS) {
    if (xp >= pl.xpRequired) current = pl;
    else break;
  }
  return current;
}

export function getNextLevel(xp) {
  for (const pl of PLAYER_LEVELS) {
    if (xp < pl.xpRequired) return pl;
  }
  return null;
}

export function getXPProgress(xp) {
  const current = getPlayerLevel(xp);
  const next = getNextLevel(xp);
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
