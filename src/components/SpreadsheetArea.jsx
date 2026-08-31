import { useCallback, useEffect, useState, useRef } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import { useGame } from '../context/GameContext';
import { findLocalizedFormulaCells, countFormulaCells } from '../utils/formulaTranslation';
import { useI18n } from '../context/I18nContext';

function prepareSheetData(initialData) {
  // Deep clone and ensure all required fields are present
  const sheets = JSON.parse(JSON.stringify(initialData));
  return sheets.map((sheet, idx) => {
    // Ensure order field
    if (sheet.order === undefined) sheet.order = idx;
    // Ensure row/column defaults
    if (!sheet.row) sheet.row = 20;
    if (!sheet.column) sheet.column = 10;
    // Without an initial selection FortuneSheet's name box renders "A1:NaN"
    if (!sheet.luckysheet_select_save) {
      sheet.luckysheet_select_save = [
        { row: [0, 0], column: [0, 0], row_focus: 0, column_focus: 0 },
      ];
    }
    // Ensure celldata has proper m (display) values
    if (sheet.celldata) {
      sheet.celldata = sheet.celldata.map((cell) => {
        if (cell.v && typeof cell.v === 'object') {
          // Add display value if missing
          if (cell.v.m === undefined && cell.v.v !== undefined) {
            cell.v.m = String(cell.v.v);
          }
          // Ensure ct has fa field
          if (cell.v.ct && !cell.v.ct.fa) {
            cell.v.ct.fa = 'General';
          }
        }
        return cell;
      });
    }
    return sheet;
  });
}

export default function SpreadsheetArea({ exercise, onDataChange }) {
  const { notifyCellEdit, notifyFormulaUse } = useGame();
  const { t } = useI18n();
  const [sheetData, setSheetData] = useState(null);
  const apiRef = useRef(null);
  const formulaCount = useRef(0);
  const hasFunctionFormulas = exercise.validations?.some(
    (v) => v.type === 'cellFormula' && /SUMME|MITTELWERT|ANZAHL|WENN/i.test(v.expected)
  );

  useEffect(() => {
    formulaCount.current = 0;
    setSheetData(prepareSheetData(exercise.initialData));
  }, [exercise.id]);

  const handleChange = useCallback(
    (data) => {
      // German/Spanish formula names: push the English formula back through the
      // Workbook API. FortuneSheet re-runs it through its native calculation
      // pipeline (deferred — never re-enter the sheet during its own onChange).
      // The API write triggers a follow-up onChange with the computed value.
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
        key={`sheet-${exercise.id}`}
        ref={apiRef}
        data={sheetData}
        onChange={handleChange}
        showToolbar={exercise.ui.showToolbar}
        showFormulaBar={exercise.ui.showFormulaBar}
        showSheetTabs={exercise.ui.showSheetTabs}
      />
    </div>
  );
}
