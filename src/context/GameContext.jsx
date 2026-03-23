import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { loadState, saveState, TRACK_INITIAL } from '../utils/storage';
import { calculateExerciseXP, calculateStars } from '../utils/xp';
import { exercises as allExercisesFromIndex } from '../exercises';

const GameContext = createContext();

// ── Badge Metadata ──────────────────────────────────────────────────────────
const BADGE_DEFS = {
  // Generic
  'first-cell': { icon: '\u{270F}\u{FE0F}', titleKey: 'badge.firstCell' },
  'first-formula': { icon: '\u{1F9EE}', titleKey: 'badge.firstFormula' },
  'sum-master': { icon: '\u{2795}', titleKey: 'badge.sumMaster' },
  'streak-3': { icon: '\u{1F525}', titleKey: 'badge.streak3' },
  'perfect-score': { icon: '\u{2B50}', titleKey: 'badge.perfectScore' },
  'speed-demon': { icon: '\u{26A1}', titleKey: 'badge.speedDemon' },
  'polyglot': { icon: '\u{1F30D}', titleKey: 'badge.polyglot' },
  // AVM
  'shopping-done': { icon: '\u{1F6D2}', titleKey: 'badge.shoppingDone' },
  'alltag-done': { icon: '\u{1F4C5}', titleKey: 'badge.alltagDone' },
  'cooking-master': { icon: '\u{1F373}', titleKey: 'badge.cookingMaster' },
  'finance-pro': { icon: '\u{1F3E0}', titleKey: 'badge.financePro' },
  'travel-expert': { icon: '\u{2708}\u{FE0F}', titleKey: 'badge.travelExpert' },
  'pro-complete': { icon: '\u{1F4BC}', titleKey: 'badge.proComplete' },
  // Kaufleute
  'referenz-meister': { icon: '\u{1F4CC}', titleKey: 'badge.referenzMeister' },
  'entscheider': { icon: '\u{2696}\u{FE0F}', titleKey: 'badge.entscheider' },
  'sverweis-meister': { icon: '\u{1F50D}', titleKey: 'badge.sverweisMeister' },
  'daten-profi': { icon: '\u{1F4CA}', titleKey: 'badge.datenProfi' },
  'visualisierer': { icon: '\u{1F3A8}', titleKey: 'badge.visualisierer' },
  'chart-creator': { icon: '\u{1F4C8}', titleKey: 'badge.chartCreator' },
  'geschaeftsfuehrer': { icon: '\u{1F680}', titleKey: 'badge.geschaeftsfuehrer' },
  'kaufmann-komplett': { icon: '\u{1F31F}', titleKey: 'badge.kaufmannKomplett' },
};

// ── Declarative Badge Triggers ──────────────────────────────────────────────
const BADGE_TRIGGERS = [
  // AVM — level completion
  { trigger: 'allInLevel', trackId: 'avm', levelId: 1, badge: 'shopping-done' },
  { trigger: 'allInLevel', trackId: 'avm', levelId: 2, badge: 'alltag-done' },
  { trigger: 'allInLevel', trackId: 'avm', levelId: 3, badge: 'cooking-master' },
  { trigger: 'allInLevel', trackId: 'avm', levelId: 4, badge: 'finance-pro' },
  { trigger: 'allInLevel', trackId: 'avm', levelId: 5, badge: 'travel-expert' },
  { trigger: 'allInLevel', trackId: 'avm', levelId: 6, badge: 'pro-complete' },
  // Kaufleute — level completion
  { trigger: 'allInLevel', trackId: 'kaufleute', levelId: 1, badge: 'referenz-meister' },
  { trigger: 'allInLevel', trackId: 'kaufleute', levelId: 3, badge: 'entscheider' },
  { trigger: 'allInLevel', trackId: 'kaufleute', levelId: 6, badge: 'daten-profi' },
  { trigger: 'allInLevel', trackId: 'kaufleute', levelId: 7, badge: 'visualisierer' },
  { trigger: 'allInLevel', trackId: 'kaufleute', levelId: 8, badge: 'geschaeftsfuehrer' },
  // Kaufleute — track completion
  { trigger: 'allInTrack', trackId: 'kaufleute', badge: 'kaufmann-komplett' },
];

// ── Initial State ───────────────────────────────────────────────────────────
const initialState = {
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

// ── Helpers ─────────────────────────────────────────────────────────────────
function getToday() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Apply an updater function to the active track's state.
 * updater receives trackState, returns partial trackState to merge.
 */
function updateActiveTrack(state, updater) {
  const track = state.selectedTrack;
  const trackState = state.tracks[track];
  const updates = updater(trackState);
  return {
    ...state,
    tracks: {
      ...state.tracks,
      [track]: { ...trackState, ...updates },
    },
  };
}

/**
 * Check all declarative badge triggers and return updated badges array.
 * exerciseResults is the *new* results map for the relevant track.
 */
function checkBadgeTriggers(trackId, exerciseResults, currentBadges) {
  const newBadges = [...currentBadges];

  for (const t of BADGE_TRIGGERS) {
    if (newBadges.includes(t.badge)) continue;

    if (t.trigger === 'allInLevel' && t.trackId === trackId) {
      const levelExercises = allExercisesFromIndex.filter(
        (e) => e.trackId === trackId && e.levelId === t.levelId
      );
      if (levelExercises.length > 0 && levelExercises.every((e) => exerciseResults[e.id])) {
        newBadges.push(t.badge);
      }
    }

    if (t.trigger === 'allInTrack' && t.trackId === trackId) {
      const trackExercises = allExercisesFromIndex.filter((e) => e.trackId === trackId);
      if (trackExercises.length > 0 && trackExercises.every((e) => exerciseResults[e.id])) {
        newBadges.push(t.badge);
      }
    }
  }

  return newBadges;
}

// ── Reducer ─────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_TRACK':
      return { ...state, selectedTrack: action.track };

    case 'SET_PROFILE':
      return { ...state, playerName: action.name, avatarId: action.avatarId };

    case 'SKIP_EXERCISE': {
      const { exerciseId } = action;
      return updateActiveTrack(state, (ts) => {
        const existing = ts.exerciseResults[exerciseId];
        if (existing) return {}; // Already completed — don't downgrade
        return {
          exerciseResults: {
            ...ts.exerciseResults,
            [exerciseId]: { stars: 0, bestTime: 0, attempts: 0, skipped: true },
          },
        };
      });
    }

    case 'COMPLETE_EXERCISE': {
      const { exerciseId, errors, timeSeconds, exercise } = action;
      const track = state.selectedTrack;
      const ts = state.tracks[track];
      const existing = ts.exerciseResults[exerciseId];
      const stars = calculateStars(errors);
      const xpEarned = calculateExerciseXP(exercise, errors, timeSeconds);

      // Only award XP if first completion or better score
      const prevStars = existing ? existing.stars : 0;
      const addXP = !existing ? xpEarned : stars > prevStars ? Math.floor(xpEarned * 0.5) : 0;

      const newResults = {
        ...ts.exerciseResults,
        [exerciseId]: {
          stars: Math.max(stars, prevStars),
          bestTime: existing ? Math.min(existing.bestTime, timeSeconds) : timeSeconds,
          attempts: (existing?.attempts || 0) + 1,
        },
      };

      // Check instant badges (perfect score, speed demon)
      let newBadges = [...ts.badges];
      if (stars === 3 && !newBadges.includes('perfect-score')) newBadges.push('perfect-score');
      if (timeSeconds < 60 && !newBadges.includes('speed-demon')) newBadges.push('speed-demon');

      // Check declarative badge triggers
      newBadges = checkBadgeTriggers(track, newResults, newBadges);

      return {
        ...state,
        tracks: {
          ...state.tracks,
          [track]: {
            ...ts,
            xp: ts.xp + addXP,
            exerciseResults: newResults,
            badges: newBadges,
          },
        },
      };
    }

    case 'UPDATE_STREAK': {
      const today = getToday();
      if (state.streak.lastDate === today) return state;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const isConsecutive = state.streak.lastDate === yesterday;
      const newCount = isConsecutive ? state.streak.count + 1 : 1;

      // Streak badge applies to active track
      const track = state.selectedTrack;
      const ts = state.tracks[track];
      const newBadges = [...ts.badges];
      if (newCount >= 3 && !newBadges.includes('streak-3')) newBadges.push('streak-3');

      return {
        ...state,
        streak: { count: newCount, lastDate: today },
        tracks: {
          ...state.tracks,
          [track]: { ...ts, badges: newBadges },
        },
      };
    }

    case 'CELL_EDITED': {
      return updateActiveTrack(state, (ts) => {
        const newBadges = [...ts.badges];
        if (!ts.firstCellEdited && !newBadges.includes('first-cell')) newBadges.push('first-cell');
        return { firstCellEdited: true, badges: newBadges };
      });
    }

    case 'FORMULA_USED': {
      return updateActiveTrack(state, (ts) => {
        const newBadges = [...ts.badges];
        if (!ts.firstFormulaWritten && !newBadges.includes('first-formula'))
          newBadges.push('first-formula');
        const newSumCount = ts.sumUseCount + 1;
        if (newSumCount >= 5 && !newBadges.includes('sum-master')) newBadges.push('sum-master');
        return { firstFormulaWritten: true, sumUseCount: newSumCount, badges: newBadges };
      });
    }

    case 'LANGUAGE_CHANGED': {
      if (state.hasChangedLanguage) return state;
      // Polyglot badge goes to active track
      return updateActiveTrack(
        { ...state, hasChangedLanguage: true },
        (ts) => {
          const newBadges = [...ts.badges];
          if (!newBadges.includes('polyglot')) newBadges.push('polyglot');
          return { badges: newBadges };
        }
      );
    }

    case 'LOAD_STATE':
      return { ...initialState, ...action.state };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

export { BADGE_DEFS, BADGE_TRIGGERS };

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = loadState();
    if (saved && saved.version === 2) {
      return {
        ...init,
        ...saved,
        tracks: {
          avm: { ...TRACK_INITIAL, ...(saved.tracks?.avm || {}) },
          kaufleute: { ...TRACK_INITIAL, ...(saved.tracks?.kaufleute || {}) },
        },
      };
    }
    return init;
  });

  // Persist on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Update streak on mount
  useEffect(() => {
    dispatch({ type: 'UPDATE_STREAK' });
  }, []);

  const setTrack = useCallback((track) => dispatch({ type: 'SET_TRACK', track }), []);

  const completeExercise = useCallback((exerciseId, errors, timeSeconds, exercise) => {
    dispatch({ type: 'COMPLETE_EXERCISE', exerciseId, errors, timeSeconds, exercise });
  }, []);

  const skipExercise = useCallback((exerciseId) => {
    dispatch({ type: 'SKIP_EXERCISE', exerciseId });
  }, []);

  const notifyCellEdit = useCallback(() => dispatch({ type: 'CELL_EDITED' }), []);
  const notifyFormulaUse = useCallback(() => dispatch({ type: 'FORMULA_USED' }), []);
  const notifyLanguageChange = useCallback(() => dispatch({ type: 'LANGUAGE_CHANGED' }), []);
  const setProfile = useCallback(
    (name, avatarId) => dispatch({ type: 'SET_PROFILE', name, avatarId }),
    []
  );
  const resetProgress = useCallback(() => dispatch({ type: 'RESET' }), []);

  const isExerciseUnlocked = useCallback(
    (exerciseId, allExercises) => {
      const ex = allExercises.find((e) => e.id === exerciseId);
      if (!ex) return false;

      // Filter exercises to the same track
      const trackExercises = allExercises.filter((e) => e.trackId === ex.trackId);
      const trackState = state.tracks[ex.trackId] || TRACK_INITIAL;

      const levelExercises = trackExercises
        .filter((e) => e.levelId === ex.levelId)
        .sort((a, b) => a.order - b.order);
      const idx = levelExercises.findIndex((e) => e.id === exerciseId);

      if (idx === 0) {
        // First exercise in level
        if (ex.levelId === 1) return true;
        const prevLevelExercises = trackExercises.filter((e) => e.levelId === ex.levelId - 1);
        return prevLevelExercises.every((e) => trackState.exerciseResults[e.id]);
      }
      // Must complete previous exercise in same level
      const prevEx = levelExercises[idx - 1];
      return !!trackState.exerciseResults[prevEx.id];
    },
    [state.tracks]
  );

  // Shorthand for active track state
  const trackState = state.tracks[state.selectedTrack] || TRACK_INITIAL;

  return (
    <GameContext.Provider
      value={{
        // Spread active track state for backward compatibility
        ...trackState,
        // Top-level shared state
        selectedTrack: state.selectedTrack,
        playerName: state.playerName,
        avatarId: state.avatarId,
        hasChangedLanguage: state.hasChangedLanguage,
        streak: state.streak,
        // Full tracks object for components that need cross-track data
        tracks: state.tracks,
        // Convenience alias
        trackState,
        // Dispatch & actions
        dispatch,
        setTrack,
        completeExercise,
        skipExercise,
        notifyCellEdit,
        notifyFormulaUse,
        notifyLanguageChange,
        setProfile,
        resetProgress,
        isExerciseUnlocked,
        badgeDefs: BADGE_DEFS,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
