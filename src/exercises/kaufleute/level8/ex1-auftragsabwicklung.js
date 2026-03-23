export default {
  id: 'K-L8-EX1',
  trackId: 'kaufleute',
  levelId: 8,
  order: 1,
  titleKey: 'kaufleute.level8.ex1.title',
  storyKey: 'kaufleute.level8.ex1.story',
  steps: [
    'kaufleute.level8.ex1.step1',
    'kaufleute.level8.ex1.step2',
    'kaufleute.level8.ex1.step3',
    'kaufleute.level8.ex1.step4',
  ],
  hints: ['kaufleute.level8.ex1.hint1', 'kaufleute.level8.ex1.hint2'],
  initialData: [
    {
      name: 'Aufgabe',
      order: 0,
      row: 10,
      column: 7,
      celldata: [
        // Headers
        { r: 0, c: 0, v: { v: 'Artikelnr', m: 'Artikelnr', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 1, v: { v: 'Bezeichnung', m: 'Bezeichnung', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 2, v: { v: 'Preis (EUR)', m: 'Preis (EUR)', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 3, v: { v: 'Menge', m: 'Menge', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 4, v: { v: 'Zwischensumme', m: 'Zwischensumme', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 5, v: { v: 'Rabatt', m: 'Rabatt', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 6, v: { v: 'Gesamt', m: 'Gesamt', ct: { fa: 'General', t: 's' }, bl: 1 } },
        // Row 1 - pre-filled article number and quantity
        { r: 1, c: 0, v: { v: 'A-2001', m: 'A-2001', ct: { fa: 'General', t: 's' } } },
        { r: 1, c: 3, v: { v: 3, m: '3', ct: { fa: 'General', t: 'n' } } },
        // Row 2
        { r: 2, c: 0, v: { v: 'A-2003', m: 'A-2003', ct: { fa: 'General', t: 's' } } },
        { r: 2, c: 3, v: { v: 5, m: '5', ct: { fa: 'General', t: 'n' } } },
        // Row 3
        { r: 3, c: 0, v: { v: 'A-2005', m: 'A-2005', ct: { fa: 'General', t: 's' } } },
        { r: 3, c: 3, v: { v: 2, m: '2', ct: { fa: 'General', t: 'n' } } },
        // Row 4
        { r: 4, c: 0, v: { v: 'A-2002', m: 'A-2002', ct: { fa: 'General', t: 's' } } },
        { r: 4, c: 3, v: { v: 10, m: '10', ct: { fa: 'General', t: 'n' } } },
      ],
      config: { columnlen: { 0: 100, 1: 140, 2: 110, 3: 80, 4: 130, 5: 90, 6: 90 } },
    },
    {
      name: 'Stammdaten',
      order: 1,
      row: 10,
      column: 3,
      celldata: [
        // Headers
        { r: 0, c: 0, v: { v: 'Artikelnr', m: 'Artikelnr', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 1, v: { v: 'Bezeichnung', m: 'Bezeichnung', ct: { fa: 'General', t: 's' }, bl: 1 } },
        { r: 0, c: 2, v: { v: 'Preis (EUR)', m: 'Preis (EUR)', ct: { fa: 'General', t: 's' }, bl: 1 } },
        // Product catalog
        { r: 1, c: 0, v: { v: 'A-2001', m: 'A-2001', ct: { fa: 'General', t: 's' } } },
        { r: 1, c: 1, v: { v: 'Laptop', m: 'Laptop', ct: { fa: 'General', t: 's' } } },
        { r: 1, c: 2, v: { v: 45.00, m: '45,00', ct: { fa: 'General', t: 'n' } } },
        { r: 2, c: 0, v: { v: 'A-2002', m: 'A-2002', ct: { fa: 'General', t: 's' } } },
        { r: 2, c: 1, v: { v: 'Maus', m: 'Maus', ct: { fa: 'General', t: 's' } } },
        { r: 2, c: 2, v: { v: 12.99, m: '12,99', ct: { fa: 'General', t: 'n' } } },
        { r: 3, c: 0, v: { v: 'A-2003', m: 'A-2003', ct: { fa: 'General', t: 's' } } },
        { r: 3, c: 1, v: { v: 'Tastatur', m: 'Tastatur', ct: { fa: 'General', t: 's' } } },
        { r: 3, c: 2, v: { v: 29.90, m: '29,90', ct: { fa: 'General', t: 'n' } } },
        { r: 4, c: 0, v: { v: 'A-2004', m: 'A-2004', ct: { fa: 'General', t: 's' } } },
        { r: 4, c: 1, v: { v: 'Monitor', m: 'Monitor', ct: { fa: 'General', t: 's' } } },
        { r: 4, c: 2, v: { v: 199.00, m: '199,00', ct: { fa: 'General', t: 'n' } } },
        { r: 5, c: 0, v: { v: 'A-2005', m: 'A-2005', ct: { fa: 'General', t: 's' } } },
        { r: 5, c: 1, v: { v: 'Headset', m: 'Headset', ct: { fa: 'General', t: 's' } } },
        { r: 5, c: 2, v: { v: 59.50, m: '59,50', ct: { fa: 'General', t: 'n' } } },
      ],
      config: { columnlen: { 0: 100, 1: 140, 2: 120 } },
    },
  ],
  lockedCells: [
    { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 0, c: 4 }, { r: 0, c: 5 }, { r: 0, c: 6 },
    { r: 1, c: 0 }, { r: 1, c: 3 },
    { r: 2, c: 0 }, { r: 2, c: 3 },
    { r: 3, c: 0 }, { r: 3, c: 3 },
    { r: 4, c: 0 }, { r: 4, c: 3 },
  ],
  ui: { showToolbar: false, showFormulaBar: true, showSheetTabs: true },
  xp: { base: 65, bonus: 25 },
  validations: [
    {
      type: 'cellFormulaAny',
      cell: { r: 1, c: 1 },
      expected: [
        'VLOOKUP(A2,Stammdaten!A:C,2,0)',
        'VLOOKUP(A2,Stammdaten!$A:$C,2,0)',
        'VLOOKUP(A2,Stammdaten!A:C,2,FALSE)',
        'VLOOKUP(A2,Stammdaten!$A:$C,2,FALSE)',
      ],
      stepIndex: 0,
    },
    {
      type: 'cellFormulaAny',
      cell: { r: 1, c: 2 },
      expected: [
        'VLOOKUP(A2,Stammdaten!A:C,3,0)',
        'VLOOKUP(A2,Stammdaten!$A:$C,3,0)',
        'VLOOKUP(A2,Stammdaten!A:C,3,FALSE)',
        'VLOOKUP(A2,Stammdaten!$A:$C,3,FALSE)',
      ],
      stepIndex: 0,
    },
    {
      type: 'cellFormulaAny',
      cell: { r: 1, c: 4 },
      expected: [
        'C2*D2',
        'D2*C2',
      ],
      stepIndex: 1,
    },
    {
      type: 'cellFormulaAny',
      cell: { r: 1, c: 5 },
      expected: [
        'IF(E2>100,E2*0.05,0)',
        'IF(E2>100,E2*5%,0)',
      ],
      stepIndex: 2,
    },
    {
      type: 'cellFormulaAny',
      cell: { r: 1, c: 6 },
      expected: [
        'E2-F2',
      ],
      stepIndex: 3,
    },
  ],
};
