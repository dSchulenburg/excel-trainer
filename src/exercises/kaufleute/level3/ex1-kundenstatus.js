export default {
  id: 'K-L3-EX1',
  trackId: 'kaufleute',
  levelId: 3,
  order: 1,
  titleKey: 'kaufleute.level3.ex1.title',
  storyKey: 'kaufleute.level3.ex1.story',
  steps: [
    'kaufleute.level3.ex1.step1',
    'kaufleute.level3.ex1.step2',
    'kaufleute.level3.ex1.step3',
    'kaufleute.level3.ex1.step4',
  ],
  hints: ['kaufleute.level3.ex1.hint1', 'kaufleute.level3.ex1.hint2'],
  initialData: [
    {
      name: 'Sheet1',
      order: 0,
      row: 10,
      column: 5,
      celldata: [
        { r: 0, c: 0, v: { v: 'Kunde', m: 'Kunde', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 1, v: { v: 'Umsatz (EUR)', m: 'Umsatz (EUR)', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 2, v: { v: 'Bestellungen', m: 'Bestellungen', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 3, v: { v: 'Status', m: 'Status', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 1, c: 0, v: { v: 'Bauer GmbH', m: 'Bauer GmbH', ct: { fa: 'General', t: 's' } } },
        { r: 2, c: 0, v: { v: 'Tech AG', m: 'Tech AG', ct: { fa: 'General', t: 's' } } },
        { r: 3, c: 0, v: { v: 'Klein OHG', m: 'Klein OHG', ct: { fa: 'General', t: 's' } } },
        { r: 4, c: 0, v: { v: 'Nord GmbH', m: 'Nord GmbH', ct: { fa: 'General', t: 's' } } },
        { r: 5, c: 0, v: { v: 'Meier KG', m: 'Meier KG', ct: { fa: 'General', t: 's' } } },
        { r: 1, c: 1, v: { v: 7200, m: '7.200', ct: { fa: 'General', t: 'n' } } },
        { r: 2, c: 1, v: { v: 3500, m: '3.500', ct: { fa: 'General', t: 'n' } } },
        { r: 3, c: 1, v: { v: 9100, m: '9.100', ct: { fa: 'General', t: 'n' } } },
        { r: 4, c: 1, v: { v: 4800, m: '4.800', ct: { fa: 'General', t: 'n' } } },
        { r: 5, c: 1, v: { v: 6300, m: '6.300', ct: { fa: 'General', t: 'n' } } },
        { r: 1, c: 2, v: { v: 5, m: '5', ct: { fa: 'General', t: 'n' } } },
        { r: 2, c: 2, v: { v: 2, m: '2', ct: { fa: 'General', t: 'n' } } },
        { r: 3, c: 2, v: { v: 7, m: '7', ct: { fa: 'General', t: 'n' } } },
        { r: 4, c: 2, v: { v: 4, m: '4', ct: { fa: 'General', t: 'n' } } },
        { r: 5, c: 2, v: { v: 3, m: '3', ct: { fa: 'General', t: 'n' } } },
      ],
      config: { columnlen: { 0: 130, 1: 120, 2: 130, 3: 110 } },
    },
  ],
  lockedCells: [
    { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 },
    { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 3, c: 0 }, { r: 4, c: 0 }, { r: 5, c: 0 },
    { r: 1, c: 1 }, { r: 2, c: 1 }, { r: 3, c: 1 }, { r: 4, c: 1 }, { r: 5, c: 1 },
    { r: 1, c: 2 }, { r: 2, c: 2 }, { r: 3, c: 2 }, { r: 4, c: 2 }, { r: 5, c: 2 },
  ],
  ui: { showToolbar: false, showFormulaBar: true, showSheetTabs: false },
  xp: { base: 42, bonus: 15 },
  validations: (() => {
    // Accept localized customer tier labels (DE/EN/UK/ES)
    const labels = [
      ['Premium', 'Standard'],
      ['Преміум', 'Стандарт'],
      ['Premium', 'Estándar'],
    ];
    const formula = (row) => labels.map(([a, b]) => `IF(AND(B${row}>5000,C${row}>3),"${a}","${b}")`);
    return [
      { type: 'cellFormula', cell: { r: 1, c: 3 }, expected: formula(2), stepIndex: 0 },
      { type: 'cellFormula', cell: { r: 2, c: 3 }, expected: formula(3), stepIndex: 1 },
      { type: 'cellFormula', cell: { r: 3, c: 3 }, expected: formula(4), stepIndex: 2 },
      { type: 'cellFormula', cell: { r: 4, c: 3 }, expected: formula(5), stepIndex: 3 },
      { type: 'cellFormula', cell: { r: 5, c: 3 }, expected: formula(6), stepIndex: 3 },
    ];
  })(),
};
