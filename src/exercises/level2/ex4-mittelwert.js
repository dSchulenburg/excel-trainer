export default {
  id: 'L2-EX4',
  levelId: 2,
  order: 4,
  titleKey: 'level2.ex4.title',
  storyKey: 'level2.ex4.story',
  steps: ['level2.ex4.step1', 'level2.ex4.step2', 'level2.ex4.step3', 'level2.ex4.step4'],
  hints: ['level2.ex4.hint1', 'level2.ex4.hint2'],
  initialData: [
    {
      name: 'Sheet1',
      order: 0,
      row: 10,
      column: 4,
      celldata: [
        { r: 0, c: 0, v: { v: 'Woche', m: 'Woche', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 1, v: { v: 'Ausgaben (\u20AC)', m: 'Ausgaben (\u20AC)', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 1, c: 0, v: { v: 'Woche 1', m: 'Woche 1', ct: { fa: 'General', t: 's' } } },
        { r: 2, c: 0, v: { v: 'Woche 2', m: 'Woche 2', ct: { fa: 'General', t: 's' } } },
        { r: 3, c: 0, v: { v: 'Woche 3', m: 'Woche 3', ct: { fa: 'General', t: 's' } } },
        { r: 5, c: 0, v: { v: 'Durchschnitt', m: 'Durchschnitt', ct: { fa: 'General', t: 's' }, bl: 1 } },
      ],
      config: { columnlen: { 0: 130, 1: 120, 2: 100, 3: 100 } },
    },
  ],
  lockedCells: [
    { r: 0, c: 0 }, { r: 0, c: 1 },
    { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 3, c: 0 }, { r: 5, c: 0 },
  ],
  ui: { showToolbar: false, showFormulaBar: true, showSheetTabs: false },
  xp: { base: 35, bonus: 15 },
  validations: [
    { type: 'cellValue', cell: { r: 1, c: 1 }, expected: 45, stepIndex: 0 },
    { type: 'cellValue', cell: { r: 2, c: 1 }, expected: 52, stepIndex: 1 },
    { type: 'cellValue', cell: { r: 3, c: 1 }, expected: 38, stepIndex: 2 },
    { type: 'cellFormula', cell: { r: 5, c: 1 }, expected: 'MITTELWERT(B2:B4)', stepIndex: 3 },
  ],
};
