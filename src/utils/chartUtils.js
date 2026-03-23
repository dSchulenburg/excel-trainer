/**
 * Extract chart data from sheet data.
 * @param {Array} sheetData - FortuneSheet data array
 * @param {{ startRow, endRow, col }} dataRange - data cells
 * @param {{ startRow, endRow, col }} labelRange - label cells
 * @returns {Array<{ name: string, value: number }>}
 */
export function extractChartData(sheetData, dataRange, labelRange) {
  const sheet = sheetData?.[0];
  if (!sheet) return [];
  const results = [];
  for (let r = dataRange.startRow; r <= dataRange.endRow; r++) {
    const dataCell = getCellFromSheet(sheet, r, dataRange.col);
    const labelCell = labelRange ? getCellFromSheet(sheet, r, labelRange.col) : null;
    const value = parseFloat(dataCell?.v ?? dataCell ?? 0);
    const name = String(labelCell?.v ?? labelCell ?? `Row ${r + 1}`);
    if (!isNaN(value)) results.push({ name, value });
  }
  return results;
}

function getCellFromSheet(sheet, r, c) {
  if (sheet.data?.[r]?.[c]) return sheet.data[r][c];
  const cell = sheet.celldata?.find(cd => cd.r === r && cd.c === c);
  return cell?.v ?? null;
}
