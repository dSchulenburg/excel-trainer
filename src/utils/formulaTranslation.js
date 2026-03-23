/**
 * German + Spanish ↔ English Excel function name translation.
 * FortuneSheet only understands English names, but students may enter
 * formulas in German (SUMME, WENN, …) or Spanish (SUMA, SI, …).
 */

const ALL_TO_EN = {
  // DE → EN
  SVERWEIS: 'VLOOKUP',
  SUMMEWENN: 'SUMIF',
  ZAEHLENWENN: 'COUNTIF',
  WENNFEHLER: 'IFERROR',
  SUMME: 'SUM',
  MITTELWERT: 'AVERAGE',
  WENN: 'IF',
  UND: 'AND',
  ODER: 'OR',
  ANZAHL: 'COUNT',
  RUNDEN: 'ROUND',
  NICHT: 'NOT',
  WAHR: 'TRUE',
  FALSCH: 'FALSE',
  VERKETTEN: 'CONCATENATE',
  // ES → EN
  BUSCARV: 'VLOOKUP',
  SUMA: 'SUM',
  PROMEDIO: 'AVERAGE',
  REDONDEAR: 'ROUND',
  CONTAR: 'COUNT',
  VERDADERO: 'TRUE',
  FALSO: 'FALSE',
};

// ES functions with dots — must be matched BEFORE single-word patterns
// because the dot would otherwise break a simple word-boundary replacement.
const ES_DOT_FUNCTIONS = {
  'SUMAR.SI': 'SUMIF',
  'CONTAR.SI': 'COUNTIF',
  'SI.ERROR': 'IFERROR',
};

// Short ES keywords — only match when directly before ( to avoid false
// positives on cell references or other identifiers that contain Y / O / SI.
const ES_SHORT = { SI: 'IF', Y: 'AND', O: 'OR' };

/**
 * Translate German/Spanish function names to English in a formula string.
 * e.g., "SUMME(B2:D2)" → "SUM(B2:D2)"
 *       "SUMAR.SI(A:A,1,B:B)" → "SUMIF(A:A,1,B:B)"
 *       "SI(Y(A1>0,B1>0),1,0)" → "IF(AND(A1>0,B1>0),1,0)"
 * Handles case-insensitive matching and preserves the rest of the formula.
 */
export function translateFormulaToEnglish(formula) {
  if (!formula) return formula;
  let result = formula;

  // 1. ES dot functions first (they contain dots, must precede word patterns)
  for (const [es, en] of Object.entries(ES_DOT_FUNCTIONS)) {
    const escaped = es.replace('.', '\\.');
    result = result.replace(new RegExp(escaped + '\\s*\\(', 'gi'), en + '(');
  }

  // 2. ALL_TO_EN entries (longer names, case-insensitive, followed by `(`)
  for (const [local, en] of Object.entries(ALL_TO_EN)) {
    result = result.replace(new RegExp(local + '\\s*\\(', 'gi'), en + '(');
  }

  // 3. Short ES keywords — use word boundary before + \s*\( after
  for (const [es, en] of Object.entries(ES_SHORT)) {
    result = result.replace(new RegExp('\\b' + es + '\\s*\\(', 'gi'), en + '(');
  }

  return result;
}

/**
 * Check if a formula contains any localized (German or Spanish) function names.
 */
export function hasLocalizedFunctions(formula) {
  if (!formula) return false;
  const upper = formula.toUpperCase();

  const inALL = Object.keys(ALL_TO_EN).some(
    (name) => upper.includes(name + '(') || upper.includes(name + ' (')
  );
  if (inALL) return true;

  const inDot = Object.keys(ES_DOT_FUNCTIONS).some(
    (name) => upper.includes(name + '(') || upper.includes(name + ' (')
  );
  if (inDot) return true;

  const inShort = Object.keys(ES_SHORT).some(
    (name) => upper.includes(name + '(') || upper.includes(name + ' (')
  );
  return inShort;
}

// Backward-compatible aliases so any code still using old names keeps working.
export { ALL_TO_EN as DE_TO_EN };
export { ALL_TO_EN, ES_DOT_FUNCTIONS, ES_SHORT };
// hasGermanFunctions kept as an alias for hasLocalizedFunctions
export { hasLocalizedFunctions as hasGermanFunctions };
