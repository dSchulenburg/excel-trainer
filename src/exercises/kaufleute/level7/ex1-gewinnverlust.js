export default {
  id: 'K-L7-EX1',
  trackId: 'kaufleute',
  levelId: 7,
  order: 1,
  titleKey: 'kaufleute.level7.ex1.title',
  storyKey: 'kaufleute.level7.ex1.story',
  steps: [
    'kaufleute.level7.ex1.step1',
    'kaufleute.level7.ex1.step2',
    'kaufleute.level7.ex1.step3',
    'kaufleute.level7.ex1.step4',
  ],
  hints: ['kaufleute.level7.ex1.hint1', 'kaufleute.level7.ex1.hint2'],
  initialData: [
    {
      name: 'Sheet1',
      order: 0,
      row: 8,
      column: 3,
      celldata: [
        // Headers
        { r: 0, c: 0, v: { v: 'Monat', m: 'Monat', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 1, v: { v: 'Ergebnis (EUR)', m: 'Ergebnis (EUR)', ct: { fa: 'General', t: 's' }, bl: 1 } },
        // Data rows - 6 months with positive and negative values
        { r: 1, c: 0, v: { v: 'Januar', m: 'Januar', ct: { fa: 'General', t: 's' } } },
        { r: 1, c: 1, v: { v: 1200, m: '1200', ct: { fa: 'General', t: 'n' } } },
        { r: 2, c: 0, v: { v: 'Februar', m: 'Februar', ct: { fa: 'General', t: 's' } } },
        { r: 2, c: 1, v: { v: -300, m: '-300', ct: { fa: 'General', t: 'n' } } },
        { r: 3, c: 0, v: { v: 'März', m: 'März', ct: { fa: 'General', t: 's' } } },
        { r: 3, c: 1, v: { v: 800, m: '800', ct: { fa: 'General', t: 'n' } } },
        { r: 4, c: 0, v: { v: 'April', m: 'April', ct: { fa: 'General', t: 's' } } },
        { r: 4, c: 1, v: { v: -1100, m: '-1100', ct: { fa: 'General', t: 'n' } } },
        { r: 5, c: 0, v: { v: 'Mai', m: 'Mai', ct: { fa: 'General', t: 's' } } },
        { r: 5, c: 1, v: { v: 2400, m: '2400', ct: { fa: 'General', t: 'n' } } },
        { r: 6, c: 0, v: { v: 'Juni', m: 'Juni', ct: { fa: 'General', t: 's' } } },
        { r: 6, c: 1, v: { v: -200, m: '-200', ct: { fa: 'General', t: 'n' } } },
      ],
      config: { columnlen: { 0: 120, 1: 140 } },
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
  xp: { base: 55, bonus: 20 },
  validations: [
    {
      type: 'conditionalFormat',
      cells: { startRow: 1, endRow: 6, col: 1 },
      rules: [
        { operator: 'greaterThan', value: 0, color: 'green' },
        { operator: 'lessThan', value: 0, color: 'red' },
      ],
      stepIndex: 2,
    },
  ],
};
