export default {
  id: 'L1-EX1',
  levelId: 1,
  order: 1,
  titleKey: 'level1.ex1.title',
  storyKey: 'level1.ex1.story',
  steps: ['level1.ex1.step1', 'level1.ex1.step2', 'level1.ex1.step3', 'level1.ex1.step4'],
  hints: ['level1.ex1.hint1', 'level1.ex1.hint2'],
  initialData: [
    {
      name: 'Sheet1',
      order: 0,
      row: 10,
      column: 4,
      celldata: [
        { r: 0, c: 0, v: { v: 'Artikel', m: 'Artikel', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 1, v: { v: 'Preis (\u20AC)', m: 'Preis (\u20AC)', ct: { fa: 'General', t: 's' }, bl: 1 } },
      ],
      config: { columnlen: { 0: 150, 1: 100, 2: 100, 3: 100 } },
    },
  ],
  lockedCells: [{ r: 0, c: 0 }, { r: 0, c: 1 }],
  ui: { showToolbar: false, showFormulaBar: true, showSheetTabs: false },
  xp: { base: 15, bonus: 5 },
  validations: [
    { type: 'cellValue', cell: { r: 1, c: 0 }, expected: 'Reis', caseInsensitive: true, stepIndex: 0 },
    { type: 'cellValue', cell: { r: 2, c: 0 }, expected: 'Nudeln', caseInsensitive: true, stepIndex: 1 },
    { type: 'cellValue', cell: { r: 3, c: 0 }, expected: 'Öl', caseInsensitive: true, stepIndex: 2 },
    { type: 'cellValue', cell: { r: 4, c: 0 }, expected: 'Salz', caseInsensitive: true, stepIndex: 3 },
  ],
};
