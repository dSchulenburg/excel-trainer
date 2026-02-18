export default {
  id: 'L2-EX2',
  levelId: 2,
  order: 2,
  titleKey: 'level2.ex2.title',
  storyKey: 'level2.ex2.story',
  steps: ['level2.ex2.step1', 'level2.ex2.step2', 'level2.ex2.step3', 'level2.ex2.step4'],
  hints: ['level2.ex2.hint1', 'level2.ex2.hint2'],
  initialData: [
    {
      name: 'Sheet1',
      order: 0,
      row: 8,
      column: 4,
      celldata: [
        { r: 0, c: 0, v: { v: 'Produkt', m: 'Produkt', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 1, v: { v: 'Aldi (\u20AC)', m: 'Aldi (\u20AC)', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 2, v: { v: 'Rewe (\u20AC)', m: 'Rewe (\u20AC)', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 1, c: 0, v: { v: 'Milch', m: 'Milch', ct: { fa: 'General', t: 's' } } },
        { r: 2, c: 0, v: { v: 'Brot', m: 'Brot', ct: { fa: 'General', t: 's' } } },
        { r: 3, c: 0, v: { v: 'Butter', m: 'Butter', ct: { fa: 'General', t: 's' } } },
      ],
      config: { columnlen: { 0: 120, 1: 100, 2: 100, 3: 100 } },
    },
  ],
  lockedCells: [
    { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
    { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 3, c: 0 },
  ],
  ui: { showToolbar: false, showFormulaBar: true, showSheetTabs: false },
  xp: { base: 30, bonus: 10 },
  validations: [
    { type: 'cellValue', cell: { r: 1, c: 1 }, expected: 1.29, stepIndex: 0 },
    { type: 'cellValue', cell: { r: 1, c: 2 }, expected: 1.59, stepIndex: 1 },
    { type: 'cellValue', cell: { r: 2, c: 1 }, expected: 0.79, stepIndex: 2 },
    { type: 'cellValue', cell: { r: 2, c: 2 }, expected: 0.99, stepIndex: 3 },
  ],
};
