export default {
  id: 'K-L2-EX1',
  trackId: 'kaufleute',
  levelId: 2,
  order: 1,
  titleKey: 'kaufleute.level2.ex1.title',
  storyKey: 'kaufleute.level2.ex1.story',
  steps: [
    'kaufleute.level2.ex1.step1',
    'kaufleute.level2.ex1.step2',
    'kaufleute.level2.ex1.step3',
    'kaufleute.level2.ex1.step4',
  ],
  hints: ['kaufleute.level2.ex1.hint1', 'kaufleute.level2.ex1.hint2'],
  initialData: [
    {
      name: 'Sheet1',
      order: 0,
      row: 8,
      column: 3,
      celldata: [
        { r: 0, c: 0, v: { v: 'Rechnung', m: 'Rechnung', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 1, v: { v: 'Betrag (EUR)', m: 'Betrag (EUR)', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 2, v: { v: 'Status', m: 'Status', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 1, c: 0, v: { v: 'RE-2024-001', m: 'RE-2024-001', ct: { fa: 'General', t: 's' } } },
        { r: 1, c: 1, v: { v: 0, m: '0', ct: { fa: 'General', t: 'n' } } },
        { r: 2, c: 0, v: { v: 'RE-2024-002', m: 'RE-2024-002', ct: { fa: 'General', t: 's' } } },
        { r: 2, c: 1, v: { v: 245.50, m: '245.50', ct: { fa: 'General', t: 'n' } } },
        { r: 3, c: 0, v: { v: 'RE-2024-003', m: 'RE-2024-003', ct: { fa: 'General', t: 's' } } },
        { r: 3, c: 1, v: { v: 0, m: '0', ct: { fa: 'General', t: 'n' } } },
        { r: 4, c: 0, v: { v: 'RE-2024-004', m: 'RE-2024-004', ct: { fa: 'General', t: 's' } } },
        { r: 4, c: 1, v: { v: 89.90, m: '89.90', ct: { fa: 'General', t: 'n' } } },
        { r: 5, c: 0, v: { v: 'RE-2024-005', m: 'RE-2024-005', ct: { fa: 'General', t: 's' } } },
        { r: 5, c: 1, v: { v: 0, m: '0', ct: { fa: 'General', t: 'n' } } },
      ],
      config: { columnlen: { 0: 130, 1: 110, 2: 110 } },
    },
  ],
  lockedCells: [
    { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
    { r: 1, c: 0 }, { r: 1, c: 1 },
    { r: 2, c: 0 }, { r: 2, c: 1 },
    { r: 3, c: 0 }, { r: 3, c: 1 },
    { r: 4, c: 0 }, { r: 4, c: 1 },
    { r: 5, c: 0 }, { r: 5, c: 1 },
  ],
  ui: { showToolbar: false, showFormulaBar: true, showSheetTabs: false },
  xp: { base: 35, bonus: 12 },
  validations: (() => {
    // Accept localized status labels (DE/EN/UK/ES) — students type from their localized prompt
    const labels = [
      ['bezahlt', 'offen'],
      ['paid', 'open'],
      ['оплачено', 'відкрито'],
      ['pagado', 'pendiente'],
    ];
    const formula = (row) => labels.map(([a, b]) => `IF(B${row}=0,"${a}","${b}")`);
    return [
      { type: 'cellFormula', cell: { r: 1, c: 2 }, expected: formula(2), stepIndex: 1 },
      { type: 'cellFormula', cell: { r: 2, c: 2 }, expected: formula(3), stepIndex: 2 },
      { type: 'cellFormula', cell: { r: 3, c: 2 }, expected: formula(4), stepIndex: 2 },
      { type: 'cellFormula', cell: { r: 4, c: 2 }, expected: formula(5), stepIndex: 2 },
      { type: 'cellFormula', cell: { r: 5, c: 2 }, expected: formula(6), stepIndex: 3 },
    ];
  })(),
};
