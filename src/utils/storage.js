const STORAGE_KEY = 'excel-trainer-v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.version !== 1) return null;
    return data.state;
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, state }));
  } catch {
    // Storage full or unavailable
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
