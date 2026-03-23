const STORAGE_KEY_V1 = 'excel-trainer-v1';
const STORAGE_KEY_V2 = 'excel-trainer-v2';

export const TRACK_INITIAL = {
  xp: 0,
  badges: [],
  exerciseResults: {},
  sumUseCount: 0,
  firstCellEdited: false,
  firstFormulaWritten: false,
};

function emptyV2State() {
  return {
    version: 2,
    selectedTrack: 'avm',
    playerName: '',
    avatarId: 0,
    hasChangedLanguage: false,
    streak: { count: 0, lastDate: null },
    tracks: {
      avm: { ...TRACK_INITIAL },
      kaufleute: { ...TRACK_INITIAL },
    },
  };
}

/**
 * Migrate v1 exercise IDs by prefixing with "A-".
 * e.g. "L1-EX1" → "A-L1-EX1"
 */
function migrateExerciseIds(exerciseResults) {
  if (!exerciseResults || typeof exerciseResults !== 'object') return {};
  const migrated = {};
  for (const [id, value] of Object.entries(exerciseResults)) {
    const newId = id.startsWith('A-') ? id : `A-${id}`;
    migrated[newId] = value;
  }
  return migrated;
}

/**
 * Attempt to migrate from v1 storage.
 * Returns a full v2 state object, or null if no v1 data was found.
 */
function migrateFromV1() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V1);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.version !== 1 || !data.state) return null;

    const v1 = data.state;

    const v2 = emptyV2State();

    // Shared top-level fields
    v2.playerName = v1.playerName || '';
    v2.avatarId = typeof v1.avatarId === 'number' ? v1.avatarId : 0;
    v2.hasChangedLanguage = !!v1.hasChangedLanguage;
    v2.streak = v1.streak && typeof v1.streak === 'object'
      ? { count: v1.streak.count || 0, lastDate: v1.streak.lastDate || null }
      : { count: 0, lastDate: null };

    // Track-specific fields → migrate into tracks.avm
    v2.tracks.avm = {
      xp: typeof v1.xp === 'number' ? v1.xp : 0,
      badges: Array.isArray(v1.badges) ? v1.badges : [],
      exerciseResults: migrateExerciseIds(v1.exerciseResults),
      sumUseCount: typeof v1.sumUseCount === 'number' ? v1.sumUseCount : 0,
      firstCellEdited: !!v1.firstCellEdited,
      firstFormulaWritten: !!v1.firstFormulaWritten,
    };

    // Remove legacy key after successful migration
    localStorage.removeItem(STORAGE_KEY_V1);

    return v2;
  } catch {
    return null;
  }
}

/**
 * Load full v2 state. Runs v1→v2 migration automatically if needed.
 * Returns a complete v2 state object, never null.
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V2);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.version === 2) {
        return data;
      }
    }
  } catch {
    // Fall through to migration / fresh state
  }

  // Try v1 migration
  const migrated = migrateFromV1();
  if (migrated) {
    // Persist the migrated state immediately
    try {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated));
    } catch {}
    return migrated;
  }

  // No existing data — return a fresh v2 state
  return emptyV2State();
}

/**
 * Persist the full v2 state object.
 */
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(state));
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Clear all storage (both v1 and v2 keys).
 */
export function clearState() {
  localStorage.removeItem(STORAGE_KEY_V1);
  localStorage.removeItem(STORAGE_KEY_V2);
}
