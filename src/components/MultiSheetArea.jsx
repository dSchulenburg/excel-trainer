import { useCallback, useEffect, useState, useRef } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import { useGame } from '../context/GameContext';
import { findLocalizedFormulaCells, countFormulaCells } from '../utils/formulaTranslation';
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
    // Without an initial selection FortuneSheet's name box renders "A1:NaN"
    if (!sheet.luckysheet_select_save) {
      sheet.luckysheet_select_save = [
        { row: [0, 0], column: [0, 0], row_focus: 0, column_focus: 0 },
      ];
    }

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
  const apiRef = useRef(null);
  const formulaCount = useRef(0);

  // Detect if exercise uses SVERWEIS/VLOOKUP-type formulas for the hint
  const hasFunctionFormulas = exercise.validations?.some(
    (v) =>
      (v.type === 'cellFormula' || v.type === 'cellFormulaAny') &&
      /SVERWEIS|VLOOKUP|SUMMEWENN|SUMIF|ZAEHLENWENN|COUNTIF|WENNFEHLER|IFERROR|SUMME|WENN/i.test(
        typeof v.expected === 'string' ? v.expected : (v.expected || []).join(' ')
      )
  );

  useEffect(() => {
    formulaCount.current = 0;
    setSheetData(prepareSheetData(exercise.initialData));
  }, [exercise.id]);

  const handleChange = useCallback(
    (data) => {
      // German/Spanish formula names: push the English formula back through the
      // Workbook API so FortuneSheet recalculates natively (see SpreadsheetArea).
      const localized = findLocalizedFormulaCells(data);
      if (localized.length > 0 && apiRef.current) {
        setTimeout(() => {
          for (const { sheetIndex, r, c, translated } of localized) {
            try {
              apiRef.current?.setCellValue(r, c, translated, { index: sheetIndex });
            } catch {
              // Sheet gone (exercise switched) — nothing to fix anymore
            }
          }
        }, 0);
      }

      onDataChange(data);
      notifyCellEdit();

      // Only report NEW formulas, else sumUseCount inflates on every edit
      const count = countFormulaCells(data);
      if (count > formulaCount.current) notifyFormulaUse();
      formulaCount.current = count;
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
        key={`multisheet-${exercise.id}`}
        ref={apiRef}
        data={sheetData}
        onChange={handleChange}
        showToolbar={exercise.ui?.showToolbar ?? false}
        showFormulaBar={exercise.ui?.showFormulaBar ?? true}
        showSheetTabs={true}
      />
    </div>
  );
}
