export default {
  id: 'K-L7-EX3',
  trackId: 'kaufleute',
  levelId: 7,
  order: 3,
  titleKey: 'kaufleute.level7.ex3.title',
  storyKey: 'kaufleute.level7.ex3.story',
  steps: [
    'kaufleute.level7.ex3.step1',
    'kaufleute.level7.ex3.step2',
    'kaufleute.level7.ex3.step3',
    'kaufleute.level7.ex3.step4',
  ],
  hints: ['kaufleute.level7.ex3.hint1', 'kaufleute.level7.ex3.hint2'],
  initialData: [
    {
      name: 'Sheet1',
      order: 0,
      row: 8,
      column: 3,
      celldata: [
        // Headers
        { r: 0, c: 0, v: { v: 'Monat', m: 'Monat', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 1, v: { v: 'Umsatz (EUR)', m: 'Umsatz (EUR)', ct: { fa: 'General', t: 's' }, bl: 1 } },
        // Data rows - 6 months pre-filled
        { r: 1, c: 0, v: { v: 'Januar', m: 'Januar', ct: { fa: 'General', t: 's' } } },
        { r: 1, c: 1, v: { v: 4200, m: '4200', ct: { fa: 'General', t: 'n' } } },
        { r: 2, c: 0, v: { v: 'Februar', m: 'Februar', ct: { fa: 'General', t: 's' } } },
        { r: 2, c: 1, v: { v: 3800, m: '3800', ct: { fa: 'General', t: 'n' } } },
        { r: 3, c: 0, v: { v: 'März', m: 'März', ct: { fa: 'General', t: 's' } } },
        { r: 3, c: 1, v: { v: 5100, m: '5100', ct: { fa: 'General', t: 'n' } } },
        { r: 4, c: 0, v: { v: 'April', m: 'April', ct: { fa: 'General', t: 's' } } },
        { r: 4, c: 1, v: { v: 4900, m: '4900', ct: { fa: 'General', t: 'n' } } },
        { r: 5, c: 0, v: { v: 'Mai', m: 'Mai', ct: { fa: 'General', t: 's' } } },
        { r: 5, c: 1, v: { v: 6200, m: '6200', ct: { fa: 'General', t: 'n' } } },
        { r: 6, c: 0, v: { v: 'Juni', m: 'Juni', ct: { fa: 'General', t: 's' } } },
        { r: 6, c: 1, v: { v: 5500, m: '5500', ct: { fa: 'General', t: 'n' } } },
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
  xp: { base: 60, bonus: 22 },
  validations: [
    {
      type: 'chartConfig',
      expected: {
        chartType: 'bar',
        dataRange: { startRow: 1, endRow: 6, col: 1 },
        labelRange: { startRow: 1, endRow: 6, col: 0 },
      },
      stepIndex: 3,
    },
  ],
};
