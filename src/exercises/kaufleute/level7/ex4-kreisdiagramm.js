export default {
  id: 'K-L7-EX4',
  trackId: 'kaufleute',
  levelId: 7,
  order: 4,
  titleKey: 'kaufleute.level7.ex4.title',
  storyKey: 'kaufleute.level7.ex4.story',
  steps: [
    'kaufleute.level7.ex4.step1',
    'kaufleute.level7.ex4.step2',
    'kaufleute.level7.ex4.step3',
    'kaufleute.level7.ex4.step4',
  ],
  hints: ['kaufleute.level7.ex4.hint1', 'kaufleute.level7.ex4.hint2'],
  initialData: [
    {
      name: 'Sheet1',
      order: 0,
      row: 6,
      column: 3,
      celldata: [
        // Headers
        { r: 0, c: 0, v: { v: 'Kategorie', m: 'Kategorie', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 1, v: { v: 'Umsatzanteil (%)', m: 'Umsatzanteil (%)', ct: { fa: 'General', t: 's' }, bl: 1 } },
        // Data rows - 4 categories pre-filled
        { r: 1, c: 0, v: { v: 'Elektronik', m: 'Elektronik', ct: { fa: 'General', t: 's' } } },
        { r: 1, c: 1, v: { v: 42, m: '42', ct: { fa: 'General', t: 'n' } } },
        { r: 2, c: 0, v: { v: 'Buerobedarf', m: 'Buerobedarf', ct: { fa: 'General', t: 's' } } },
        { r: 2, c: 1, v: { v: 28, m: '28', ct: { fa: 'General', t: 'n' } } },
        { r: 3, c: 0, v: { v: 'Moebel', m: 'Moebel', ct: { fa: 'General', t: 's' } } },
        { r: 3, c: 1, v: { v: 18, m: '18', ct: { fa: 'General', t: 'n' } } },
        { r: 4, c: 0, v: { v: 'Sonstiges', m: 'Sonstiges', ct: { fa: 'General', t: 's' } } },
        { r: 4, c: 1, v: { v: 12, m: '12', ct: { fa: 'General', t: 'n' } } },
      ],
      config: { columnlen: { 0: 140, 1: 150 } },
    },
  ],
  lockedCells: [
    { r: 0, c: 0 }, { r: 0, c: 1 },
    { r: 1, c: 0 }, { r: 1, c: 1 },
    { r: 2, c: 0 }, { r: 2, c: 1 },
    { r: 3, c: 0 }, { r: 3, c: 1 },
    { r: 4, c: 0 }, { r: 4, c: 1 },
  ],
  ui: { showToolbar: false, showFormulaBar: false, showSheetTabs: false },
  xp: { base: 62, bonus: 25 },
  validations: [
    {
      type: 'chartConfig',
      expected: {
        chartType: 'pie',
        dataRange: { startRow: 1, endRow: 4, col: 1 },
        labelRange: { startRow: 1, endRow: 4, col: 0 },
      },
      stepIndex: 3,
    },
  ],
};
