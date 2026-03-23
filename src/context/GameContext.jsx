import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { loadState, saveState } from '../utils/storage';
import { calculateExerciseXP, calculateStars } from '../utils/xp';

const GameContext = createContext();

const BADGE_DEFS = {
  'first-cell': { icon: '✏️', titleKey: 'badge.firstCell' },
  'first-formula': { icon: '🧮', titleKey: 'badge.firstFormula' },
  'shopping-done': { icon: '🛒', titleKey: 'badge.shoppingDone' },
  'alltag-done': { icon: '📅', titleKey: 'badge.alltagDone' },
  'cooking-master': { icon: '🍳', titleKey: 'badge.cookingMaster' },
  'finance-pro': { icon: '🏠', titleKey: 'badge.financePro' },
  'travel-expert': { icon: '✈️', titleKey: 'badge.travelExpert' },
  'pro-complete': { icon: '💼', titleKey: 'badge.proComplete' },
  'sum-master': { icon: '➕', titleKey: 'badge.sumMaster' },
  'streak-3': { icon: '🔥', titleKey: 'badge.streak3' },
  'perfect-score': { icon: '⭐', titleKey: 'badge.perfectScore' },
  'speed-demon': { icon: '⚡', titleKey: 'badge.speedDemon' },
  'polyglot': { icon: '🌍', titleKey: 'badge.polyglot' },
};

const initialState = {
  playerName: '',
  avatarId: 0,
  xp: 0,
  badges: [],
  exerciseResults: {},
  streak: { count: 0, lastDate: null },
  sumUseCount: 0,
  hasChangedLanguage: false,
  firstCellEdited: false,
  firstFormulaWritten: false,
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, playerName: action.name, avatarId: action.avatarId };

    case 'SKIP_EXERCISE': {
      const { exerciseId } = action;
      const existing = state.exerciseResults[exerciseId];
      if (existing) return state; // Already completed — don't downgrade
      const newResults = {
        ...state.exerciseResults,
        [exerciseId]: { stars: 0, bestTime: 0, attempts: 0, skipped: true },
      };
      return { ...state, exerciseResults: newResults };
    }

    case 'COMPLETE_EXERCISE': {
      const { exerciseId, errors, timeSeconds, exercise } = action;
      const existing = state.exerciseResults[exerciseId];
      const stars = calculateStars(errors);
      const xpEarned = calculateExerciseXP(exercise, errors, timeSeconds);

      // Only award XP if first completion or better score
      const prevStars = existing ? existing.stars : 0;
      const addXP = !existing ? xpEarned : stars > prevStars ? Math.floor(xpEarned * 0.5) : 0;

      const newResults = {
        ...state.exerciseResults,
        [exerciseId]: {
          stars: Math.max(stars, prevStars),
          bestTime: existing ? Math.min(existing.bestTime, timeSeconds) : timeSeconds,
          attempts: (existing?.attempts || 0) + 1,
        },
      };

      // Check badges
      const newBadges = [...state.badges];
      if (stars === 3 && !newBadges.includes('perfect-score')) newBadges.push('perfect-score');
      if (timeSeconds < 60 && !newBadges.includes('speed-demon')) newBadges.push('speed-demon');

      // Check if levels complete
      const levelBadges = [
        { ids: ['L1-EX1', 'L1-EX2', 'L1-EX3', 'L1-EX4'], badge: 'shopping-done' },
        { ids: ['L2-EX1', 'L2-EX2', 'L2-EX3', 'L2-EX4'], badge: 'alltag-done' },
        { ids: ['L3-EX1', 'L3-EX2', 'L3-EX3', 'L3-EX4'], badge: 'cooking-master' },
        { ids: ['L4-EX1', 'L4-EX2', 'L4-EX3', 'L4-EX4'], badge: 'finance-pro' },
        { ids: ['L5-EX1', 'L5-EX2', 'L5-EX3', 'L5-EX4'], badge: 'travel-expert' },
        { ids: ['L6-EX1', 'L6-EX2', 'L6-EX3', 'L6-EX4'], badge: 'pro-complete' },
      ];
      for (const { ids, badge } of levelBadges) {
        const allDone = ids.every((id) => newResults[id] || id === exerciseId);
        if (allDone && !newBadges.includes(badge)) newBadges.push(badge);
      }

      return { ...state, xp: state.xp + addXP, exerciseResults: newResults, badges: newBadges };
    }

    case 'UPDATE_STREAK': {
      const today = getToday();
      if (state.streak.lastDate === today) return state;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const isConsecutive = state.streak.lastDate === yesterday;
      const newCount = isConsecutive ? state.streak.count + 1 : 1;
      const newBadges = [...state.badges];
      if (newCount >= 3 && !newBadges.includes('streak-3')) newBadges.push('streak-3');
      return { ...state, streak: { count: newCount, lastDate: today }, badges: newBadges };
    }

    case 'CELL_EDITED': {
      const newBadges = [...state.badges];
      if (!state.firstCellEdited && !newBadges.includes('first-cell')) newBadges.push('first-cell');
      return { ...state, firstCellEdited: true, badges: newBadges };
    }

    case 'FORMULA_USED': {
      const newBadges = [...state.badges];
      if (!state.firstFormulaWritten && !newBadges.includes('first-formula')) newBadges.push('first-formula');
      const newSumCount = state.sumUseCount + 1;
      if (newSumCount >= 5 && !newBadges.includes('sum-master')) newBadges.push('sum-master');
      return { ...state, firstFormulaWritten: true, sumUseCount: newSumCount, badges: newBadges };
    }

    case 'LANGUAGE_CHANGED': {
      if (state.hasChangedLanguage) return state;
      const newBadges = [...state.badges];
      if (!newBadges.includes('polyglot')) newBadges.push('polyglot');
      return { ...state, hasChangedLanguage: true, badges: newBadges };
    }

    case 'LOAD_STATE':
      return { ...initialState, ...action.state };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

export { BADGE_DEFS };

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = loadState();
    return saved ? { ...init, ...saved } : init;
  });

  // Persist on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Update streak on mount
  useEffect(() => {
    dispatch({ type: 'UPDATE_STREAK' });
  }, []);

  const completeExercise = useCallback((exerciseId, errors, timeSeconds, exercise) => {
    dispatch({ type: 'COMPLETE_EXERCISE', exerciseId, errors, timeSeconds, exercise });
  }, []);

  const skipExercise = useCallback((exerciseId) => {
    dispatch({ type: 'SKIP_EXERCISE', exerciseId });
  }, []);

  const notifyCellEdit = useCallback(() => dispatch({ type: 'CELL_EDITED' }), []);
  const notifyFormulaUse = useCallback(() => dispatch({ type: 'FORMULA_USED' }), []);
  const notifyLanguageChange = useCallback(() => dispatch({ type: 'LANGUAGE_CHANGED' }), []);
  const setProfile = useCallback((name, avatarId) => dispatch({ type: 'SET_PROFILE', name, avatarId }), []);
  const resetProgress = useCallback(() => dispatch({ type: 'RESET' }), []);

  const isExerciseUnlocked = useCallback(
    (exerciseId, allExercises) => {
      // First exercise of each level: unlock if previous level is done OR it's level 1
      const ex = allExercises.find((e) => e.id === exerciseId);
      if (!ex) return false;
      const levelExercises = allExercises
        .filter((e) => e.levelId === ex.levelId)
        .sort((a, b) => a.order - b.order);
      const idx = levelExercises.findIndex((e) => e.id === exerciseId);

      if (idx === 0) {
        // First exercise in level
        if (ex.levelId === 1) return true;
        const prevLevelExercises = allExercises.filter((e) => e.levelId === ex.levelId - 1);
        return prevLevelExercises.every((e) => state.exerciseResults[e.id]);
      }
      // Must complete previous exercise in same level
      const prevEx = levelExercises[idx - 1];
      return !!state.exerciseResults[prevEx.id];
    },
    [state.exerciseResults]
  );

  return (
    <GameContext.Provider
      value={{
        ...state,
        dispatch,
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
