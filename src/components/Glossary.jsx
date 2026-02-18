import { useI18n } from '../context/I18nContext';

const TERMS = [
  { de: 'Zelle', en: 'Cell', desc: 'glossary.cell' },
  { de: 'Spalte', en: 'Column', desc: 'glossary.column' },
  { de: 'Zeile', en: 'Row', desc: 'glossary.row' },
  { de: 'Formel', en: 'Formula', desc: 'glossary.formula' },
  { de: 'SUMME', en: 'SUM', desc: 'glossary.sum' },
  { de: 'MITTELWERT', en: 'AVERAGE', desc: 'glossary.average' },
  { de: 'Arbeitsblatt', en: 'Worksheet', desc: 'glossary.worksheet' },
  { de: 'Bereich', en: 'Range', desc: 'glossary.range' },
  { de: 'Wert', en: 'Value', desc: 'glossary.value' },
  { de: 'Text', en: 'Text', desc: 'glossary.text' },
];

const DESCRIPTIONS = {
  'glossary.cell': 'Ein einzelnes Feld in der Tabelle (z.B. A1)',
  'glossary.column': 'Eine senkrechte Reihe (A, B, C...)',
  'glossary.row': 'Eine waagerechte Reihe (1, 2, 3...)',
  'glossary.formula': 'Eine Berechnung, beginnt mit =',
  'glossary.sum': 'Addiert alle Zahlen in einem Bereich',
  'glossary.average': 'Berechnet den Durchschnitt',
  'glossary.worksheet': 'Ein Tabellenblatt in der Datei',
  'glossary.range': 'Mehrere Zellen zusammen (z.B. A1:A5)',
  'glossary.value': 'Der Inhalt einer Zelle',
  'glossary.text': 'Buchstaben und Woerter in einer Zelle',
};

export default function Glossary() {
  const { t } = useI18n();

  return (
    <div className="glossary">
      <h1 className="glossary__title">{t('glossary.title')}</h1>
      <table className="glossary__table">
        <thead>
          <tr>
            <th>{t('glossary.german')}</th>
            <th>{t('glossary.english')}</th>
            <th>{t('glossary.description')}</th>
          </tr>
        </thead>
        <tbody>
          {TERMS.map((term) => (
            <tr key={term.de}>
              <td><strong>{term.de}</strong></td>
              <td>{term.en}</td>
              <td>{DESCRIPTIONS[term.desc]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
