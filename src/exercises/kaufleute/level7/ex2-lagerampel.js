export default {
  id: 'K-L7-EX2',
  trackId: 'kaufleute',
  levelId: 7,
  order: 2,
  titleKey: 'kaufleute.level7.ex2.title',
  storyKey: 'kaufleute.level7.ex2.story',
  steps: [
    'kaufleute.level7.ex2.step1',
    'kaufleute.level7.ex2.step2',
    'kaufleute.level7.ex2.step3',
    'kaufleute.level7.ex2.step4',
  ],
  hints: ['kaufleute.level7.ex2.hint1', 'kaufleute.level7.ex2.hint2'],
  initialData: [
    {
      name: 'Sheet1',
      order: 0,
      row: 8,
      column: 3,
      celldata: [
        // Headers
        { r: 0, c: 0, v: { v: 'Artikel', m: 'Artikel', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 1, v: { v: 'Bestand', m: 'Bestand', ct: { fa: 'General', t: 's' }, bl: 1 } },
        // Data rows - 6 products with various stock levels
        { r: 1, c: 0, v: { v: 'Ordner', m: 'Ordner', ct: { fa: 'General', t: 's' } } },
        { r: 1, c: 1, v: { v: 5, m: '5', ct: { fa: 'General', t: 'n' } } },
        { r: 2, c: 0, v: { v: 'Papier', m: 'Papier', ct: { fa: 'General', t: 's' } } },
        { r: 2, c: 1, v: { v: 45, m: '45', ct: { fa: 'General', t: 'n' } } },
        { r: 3, c: 0, v: { v: 'Stifte', m: 'Stifte', ct: { fa: 'General', t: 's' } } },
        { r: 3, c: 1, v: { v: 120, m: '120', ct: { fa: 'General', t: 'n' } } },
        { r: 4, c: 0, v: { v: 'Kleber', m: 'Kleber', ct: { fa: 'General', t: 's' } } },
        { r: 4, c: 1, v: { v: 8, m: '8', ct: { fa: 'General', t: 'n' } } },
        { r: 5, c: 0, v: { v: 'Marker', m: 'Marker', ct: { fa: 'General', t: 's' } } },
        { r: 5, c: 1, v: { v: 55, m: '55', ct: { fa: 'General', t: 'n' } } },
        { r: 6, c: 0, v: { v: 'Tacker', m: 'Tacker', ct: { fa: 'General', t: 's' } } },
        { r: 6, c: 1, v: { v: 12, m: '12', ct: { fa: 'General', t: 'n' } } },
      ],
      config: { columnlen: { 0: 120, 1: 120 } },
    },
  ],
  lockedCells: [
    { r: 0, c: 0 }, { r: 0, c: 1 },
    { r: 1, c: 0 }, { r: 1, c: 1 },
    { r: 2, c: 0 }, { r: 2, c: 1 },
    { r: 3, c: 0 }, { r: 3, c: 1 },
    { r: 4, c: 0 }, { r: 4, c: 1 },
    { r: 5, c: 0 }, { r: 5, c: 1 },
    { r: 6, c: 0 }, { r: 6, c: 1 },
  ],
  ui: { showToolbar: false, showFormulaBar: false, showSheetTabs: false },
  xp: { base: 58, bonus: 22 },
  validations: [
    {
      type: 'conditionalFormat',
      cells: { startRow: 1, endRow: 6, col: 1 },
      rules: [
        { operator: 'lessThan', value: 10, color: 'red' },
        { operator: 'greaterThan', value: 50, color: 'green' },
      ],
      stepIndex: 2,
    },
  ],
};
