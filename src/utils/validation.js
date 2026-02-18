/**
 * Validate exercise cells against expected values.
 * Returns { passed: boolean, results: [...], errors: number }
 */
export function validateExercise(validations, sheetData) {
  const results = [];
  let errors = 0;

  for (const v of validations) {
    const result = validateSingle(v, sheetData);
    results.push(result);
    if (!result.passed) errors++;
  }

  return { passed: errors === 0, results, errors };
}

function getCellData(sheetData, r, c) {
  if (!sheetData || !sheetData[0]) return null;
  const sheet = sheetData[0];
  // FortuneSheet onChange returns data as 2D array (sheet.data),
  // while initial config uses sparse celldata format.
  // Check both: prefer 2D data array (always up-to-date), fall back to celldata.
  if (sheet.data && sheet.data[r] && sheet.data[r][c] != null) {
    return sheet.data[r][c];
  }
  const celldata = sheet.celldata || [];
  const cell = celldata.find((cd) => cd.r === r && cd.c === c);
  return cell ? cell.v : null;
}

function getCellValue(sheetData, r, c) {
  const cell = getCellData(sheetData, r, c);
  if (!cell) return null;
  if (typeof cell === 'object') return cell.v ?? cell.m ?? null;
  return cell;
}

function getCellFormula(sheetData, r, c) {
  const cell = getCellData(sheetData, r, c);
  if (!cell || typeof cell !== 'object') return null;
  return cell.f || null;
}

function normalizeFormula(f) {
  if (!f) return '';
  return f.replace(/\s/g, '').toUpperCase().replace(/^=/, '');
}

/**
 * Parse a number that may use German decimal comma (1,99) or period (1.99).
 */
function parseLocalNumber(val) {
  if (typeof val === 'number') return val;
  if (typeof val !== 'string') return NaN;
  // Replace comma with period for parsing (German decimal separator)
  const normalized = val.trim().replace(',', '.');
  return parseFloat(normalized);
}

function validateSingle(v, sheetData) {
  const { type, stepIndex } = v;

  switch (type) {
    case 'cellValue': {
      const val = getCellValue(sheetData, v.cell.r, v.cell.c);
      let expected = v.expected;
      let actual = val;
      if (v.caseInsensitive && typeof actual === 'string' && typeof expected === 'string') {
        actual = actual.toLowerCase().trim();
        expected = expected.toLowerCase().trim();
      }
      if (typeof expected === 'number') {
        actual = parseLocalNumber(actual);
        const passed = !isNaN(actual) && Math.abs(actual - expected) < 0.01;
        return { type, stepIndex, passed, expected: v.expected, actual: val };
      }
      return { type, stepIndex, passed: actual === expected, expected: v.expected, actual: val };
    }

    case 'cellFormula': {
      const f = getCellFormula(sheetData, v.cell.r, v.cell.c);
      const normActual = normalizeFormula(f);
      const normExpected = normalizeFormula(v.expected);
      // Also accept English equivalent
      const altExpected = normExpected.replace('SUMME', 'SUM').replace('MITTELWERT', 'AVERAGE');
      const passed = normActual === normExpected || normActual === altExpected;
      return { type, stepIndex, passed, expected: v.expected, actual: f };
    }

    case 'cellFormulaResult': {
      const val = getCellValue(sheetData, v.cell.r, v.cell.c);
      const num = parseLocalNumber(val);
      const passed = !isNaN(num) && Math.abs(num - v.expected) < 0.01;
      return { type, stepIndex, passed, expected: v.expected, actual: val };
    }

    case 'cellNotEmpty': {
      const cells = v.cells || [v.cell];
      let allFilled = true;
      for (const c of cells) {
        const val = getCellValue(sheetData, c.r, c.c);
        if (val === null || val === '' || val === undefined) {
          allFilled = false;
          break;
        }
      }
      return { type, stepIndex, passed: allFilled };
    }

    case 'cellIsNumber': {
      const cells = v.cells || [v.cell];
      let allNumbers = true;
      for (const c of cells) {
        const val = getCellValue(sheetData, c.r, c.c);
        if (val === null || val === '' || isNaN(parseLocalNumber(val))) {
          allNumbers = false;
          break;
        }
      }
      return { type, stepIndex, passed: allNumbers };
    }

    default:
      return { type, stepIndex, passed: false, error: `Unknown validation type: ${type}` };
  }
}

/**
 * Check which steps are completed based on validations
 */
export function getCompletedSteps(validations, sheetData) {
  const stepMap = new Map();
  for (const v of validations) {
    const result = validateSingle(v, sheetData);
    const idx = v.stepIndex;
    if (!stepMap.has(idx)) stepMap.set(idx, true);
    if (!result.passed) stepMap.set(idx, false);
  }
  return stepMap;
}
