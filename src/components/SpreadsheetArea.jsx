import { useCallback, useEffect, useState, useRef } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import { useGame } from '../context/GameContext';

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

export default function SpreadsheetArea({ exercise, onDataChange }) {
  const { notifyCellEdit, notifyFormulaUse } = useGame();
  const [sheetData, setSheetData] = useState(null);
  const mountKey = useRef(0);

  useEffect(() => {
    mountKey.current += 1;
    const prepared = prepareSheetData(exercise.initialData);
    setSheetData(prepared);
  }, [exercise.id]);

  const handleChange = useCallback(
    (data) => {
      onDataChange(data);
      notifyCellEdit();
      if (data && data[0]?.celldata) {
        const hasFormula = data[0].celldata.some(
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
