import { useCallback, useEffect, useState, useRef } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import { useGame } from '../context/GameContext';
import { translateFormulaToEnglish, hasGermanFunctions } from '../utils/formulaTranslation';
import { useI18n } from '../context/I18nContext';

/**
 * Prepare sheet data for FortuneSheet — deep clone, set defaults, fix display values.
 * For multi-sheet exercises, Sheet 0 is the editable work area and Sheet 1+ are
 * read-only lookup tables (Stammdaten).
 */
function prepareSheetData(initialData) {
  const sheets = JSON.parse(JSON.stringify(initialData));
  return sheets.map((sheet, idx) => {
    if (sheet.order === undefined) sheet.order = idx;
    if (!sheet.row) sheet.row = 20;
    if (!sheet.column) sheet.column = 10;

    if (sheet.celldata) {
      sheet.celldata = sheet.celldata.map((cell) => {
        if (cell.v && typeof cell.v === 'object') {
          if (cell.v.m === undefined && cell.v.v !== undefined) {
            cell.v.m = String(cell.v.v);
          }
          if (cell.v.ct && !cell.v.ct.fa) {
            cell.v.ct.fa = 'General';
          }
        }
        return cell;
      });
    }

    // For lookup sheets (index > 0), mark as status 0 (hidden from editing)
    // and set the sheet to active only for sheet 0
    if (idx === 0) {
      sheet.status = 1; // Active sheet
    }

    return sheet;
  });
}

/**
 * Scan all sheets for German/Spanish formula names, translate to English.
 * Returns { sheets, changed } — sheets is a deep copy with translated formulas.
 */
function translateGermanFormulas(sheets) {
  let changed = false;
  const result = JSON.parse(JSON.stringify(sheets));

  for (const sheet of result) {
    // Scan 2D data array (primary source after edits)
    if (sheet.data) {
      for (let r = 0; r < sheet.data.length; r++) {
        if (!sheet.data[r]) continue;
        for (let c = 0; c < sheet.data[r].length; c++) {
          const cell = sheet.data[r][c];
          if (cell?.f && hasGermanFunctions(cell.f)) {
            cell.f = translateFormulaToEnglish(cell.f);
            changed = true;
          }
        }
      }
    }

    // Also check sparse celldata
    if (sheet.celldata) {
      for (const entry of sheet.celldata) {
        if (entry.v?.f && hasGermanFunctions(entry.v.f)) {
          entry.v.f = translateFormulaToEnglish(entry.v.f);
          changed = true;
        }
      }
    }

    // For remount: rebuild celldata from 2D data (preserves all user edits)
    if (changed && sheet.data) {
      const celldata = [];
      for (let r = 0; r < sheet.data.length; r++) {
        if (!sheet.data[r]) continue;
        for (let c = 0; c < sheet.data[r].length; c++) {
          const cell = sheet.data[r][c];
          if (cell != null) {
            celldata.push({ r, c, v: cell });
          }
        }
      }
      sheet.celldata = celldata;
      delete sheet.data; // Force FortuneSheet to use celldata on re-init
    }
  }

  return { sheets: result, changed };
}

/**
 * MultiSheetArea — FortuneSheet with multiple sheet tabs for SVERWEIS exercises.
 *
 * Uses a single <Workbook> with 2+ sheets in its data array:
 *   - Sheet 0 ("Aufgabe"): editable work area where student enters VLOOKUP formulas
 *   - Sheet 1+ ("Stammdaten"): read-only lookup table(s)
 *
 * FortuneSheet resolves cross-sheet references (e.g. Stammdaten!A:C) internally
 * because both sheets live in the same Workbook instance.
 *
 * Validation always runs against Sheet 0 (the work sheet).
 */
export default function MultiSheetArea({ exercise, onDataChange }) {
  const { notifyCellEdit, notifyFormulaUse } = useGame();
  const { t } = useI18n();
  const [sheetData, setSheetData] = useState(null);
  const mountKey = useRef(0);

  // Detect if exercise uses SVERWEIS/VLOOKUP-type formulas for the hint
  const hasFunctionFormulas = exercise.validations?.some(
    (v) =>
      (v.type === 'cellFormula' || v.type === 'cellFormulaAny') &&
      /SVERWEIS|VLOOKUP|SUMMEWENN|SUMIF|ZAEHLENWENN|COUNTIF|WENNFEHLER|IFERROR|SUMME|WENN/i.test(
        typeof v.expected === 'string' ? v.expected : (v.expected || []).join(' ')
      )
  );

  useEffect(() => {
    mountKey.current += 1;
    const prepared = prepareSheetData(exercise.initialData);
    setSheetData(prepared);
  }, [exercise.id]);

  const handleChange = useCallback(
    (data) => {
      // Auto-translate German/Spanish formula names → English
      const { sheets, changed } = translateGermanFormulas(data);

      if (changed) {
        // Remount with translated formulas
        setSheetData(prepareSheetData(sheets));
        mountKey.current += 1;
        onDataChange(sheets);
      } else {
        onDataChange(data);
      }

      notifyCellEdit();

      // Check if any formula was used (across all sheets)
      const checkData = changed ? sheets : data;
      if (checkData) {
        const hasFormula = checkData.some((sheet) => {
          if (sheet.celldata) {
            return sheet.celldata.some(
              (c) => c.v && typeof c.v === 'object' && c.v.f
            );
          }
          if (sheet.data) {
            return sheet.data.some(
              (row) => row && row.some((cell) => cell?.f)
            );
          }
          return false;
        });
        if (hasFormula) notifyFormulaUse();
      }
    },
    [onDataChange, notifyCellEdit, notifyFormulaUse]
  );

  if (!sheetData) return null;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {hasFunctionFormulas && (
        <div className="formula-hint">
          {t('exercise.formulaHint')}
        </div>
      )}
      <Workbook
        key={`multisheet-${exercise.id}-${mountKey.current}`}
        data={sheetData}
        onChange={handleChange}
        showToolbar={exercise.ui?.showToolbar ?? false}
        showFormulaBar={exercise.ui?.showFormulaBar ?? true}
        showSheetTabs={true}
      />
    </div>
  );
}
