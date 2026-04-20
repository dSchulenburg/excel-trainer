export default {
  id: 'A-L2-EX1',
  trackId: 'avm',
  levelId: 2,
  order: 1,
  titleKey: 'level2.ex1.title',
  storyKey: 'level2.ex1.story',
  steps: ['level2.ex1.step1', 'level2.ex1.step2', 'level2.ex1.step3', 'level2.ex1.step4'],
  hints: ['level2.ex1.hint1', 'level2.ex1.hint2'],
  initialData: [
    {
      name: 'Sheet1',
      order: 0,
      row: 10,
      column: 4,
      celldata: [
        { r: 0, c: 0, v: { v: 'Tag', m: 'Tag', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 1, v: { v: 'Aktivität', m: 'Aktivität', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 2, v: { v: 'Uhrzeit', m: 'Uhrzeit', ct: { fa: 'General', t: 's' }, bl: 1 } },
      ],
      config: { columnlen: { 0: 120, 1: 200, 2: 100, 3: 100 } },
    },
  ],
  lockedCells: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }],
  ui: { showToolbar: false, showFormulaBar: true, showSheetTabs: false },
  xp: { base: 25, bonus: 5 },
  validations: [
    // Accept DE/EN/UK/ES weekday names
    { type: 'cellValue', cell: { r: 1, c: 0 }, expected: ['Montag', 'Monday', 'Понеділок', 'Lunes'], caseInsensitive: true, stepIndex: 0 },
    { type: 'cellValue', cell: { r: 2, c: 0 }, expected: ['Dienstag', 'Tuesday', 'Вівторок', 'Martes'], caseInsensitive: true, stepIndex: 1 },
    { type: 'cellValue', cell: { r: 3, c: 0 }, expected: ['Mittwoch', 'Wednesday', 'Середа', 'Miércoles'], caseInsensitive: true, stepIndex: 2 },
    { type: 'cellNotEmpty', cells: [{ r: 1, c: 1 }], stepIndex: 3 },
  ],
};
