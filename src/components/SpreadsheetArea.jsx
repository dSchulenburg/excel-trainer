import { useCallback, useEffect, useState, useRef } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import { useGame } from '../context/GameContext';
import { translateFormulaToEnglish, hasGermanFunctions } from '../utils/formulaTranslation';
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
            cell.v.ct.fa = cell.v.ct.t === 'n' ? 'General' : 'General';
          }
        }
        return cell;
      });
    }
    return sheet;
  });
}

/**
 * Scan sheet data for German formula names, translate to English.
 * Returns { sheets, changed } — sheets is a deep copy with translated formulas,
 * converted to sparse celldata format for re-initialization.
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

export default function SpreadsheetArea({ exercise, onDataChange }) {
  const { notifyCellEdit, notifyFormulaUse } = useGame();
  const { t } = useI18n();
  const [sheetData, setSheetData] = useState(null);
  const mountKey = useRef(0);
  const hasFunctionFormulas = exercise.validations?.some(
    (v) => v.type === 'cellFormula' && /SUMME|MITTELWERT|ANZAHL|WENN/i.test(v.expected)
  );

  useEffect(() => {
    mountKey.current += 1;
    const prepared = prepareSheetData(exercise.initialData);
    setSheetData(prepared);
  }, [exercise.id]);

  const handleChange = useCallback(
    (data) => {
      // Auto-translate German formula names → English so FortuneSheet can compute
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
      const checkData = changed ? sheets : data;
      if (checkData && checkData[0]?.celldata) {
        const hasFormula = checkData[0].celldata.some(
          (c) => c.v && typeof c.v === 'object' && c.v.f
        );
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
        key={`sheet-${exercise.id}-${mountKey.current}`}
        data={sheetData}
        onChange={handleChange}
        showToolbar={exercise.ui.showToolbar}
        showFormulaBar={exercise.ui.showFormulaBar}
        showSheetTabs={exercise.ui.showSheetTabs}
      />
    </div>
  );
}
