/**
 * German ↔ English Excel function name translation.
 * FortuneSheet only understands English names, but German students
 * learn SUMME, MITTELWERT, ANZAHL etc.
 */

const DE_TO_EN = {
  SUMME: 'SUM',
  MITTELWERT: 'AVERAGE',
  ANZAHL: 'COUNT',
  WENN: 'IF',
  RUNDEN: 'ROUND',
  UND: 'AND',
  ODER: 'OR',
  NICHT: 'NOT',
  WAHR: 'TRUE',
  FALSCH: 'FALSE',
  VERKETTEN: 'CONCATENATE',
};

/**
 * Translate German function names to English in a formula string.
 * e.g., "SUMME(B2:D2)" → "SUM(B2:D2)"
 * Handles case-insensitive matching and preserves the rest of the formula.
 */
export function translateFormulaToEnglish(formula) {
  if (!formula) return formula;
  let result = formula;
  for (const [de, en] of Object.entries(DE_TO_EN)) {
    // Match function name followed by ( — case insensitive
    result = result.replace(new RegExp(de + '\\s*\\(', 'gi'), en + '(');
  }
  return result;
}

/**
 * Check if a formula contains any German function names.
 */
export function hasGermanFunctions(formula) {
  if (!formula) return false;
  const upper = formula.toUpperCase();
  return Object.keys(DE_TO_EN).some((de) => upper.includes(de + '(') || upper.includes(de + ' ('));
}

export { DE_TO_EN };
