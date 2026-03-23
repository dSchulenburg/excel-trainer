import { useState } from 'react';
import { useI18n } from '../context/I18nContext';

const COLOR_OPTIONS = [
  { name: 'green', hex: '#C6EFCE', label: 'condFormat.colorGreen' },
  { name: 'red', hex: '#FFC7CE', label: 'condFormat.colorRed' },
  { name: 'yellow', hex: '#FFEB9C', label: 'condFormat.colorYellow' },
];

const OPERATORS = [
  { value: 'greaterThan', label: 'condFormat.greaterThan' },
  { value: 'lessThan', label: 'condFormat.lessThan' },
  { value: 'equals', label: 'condFormat.equals' },
];

export default function ConditionalFormatEditor({ onApplyRules, onRulesChange }) {
  const { t } = useI18n();
  const [rules, setRules] = useState([{ operator: 'greaterThan', value: '', color: 'green' }]);

  const addRule = () => {
    setRules(prev => [...prev, { operator: 'greaterThan', value: '', color: 'green' }]);
  };

  const removeRule = (index) => {
    setRules(prev => prev.filter((_, i) => i !== index));
  };

  const updateRule = (index, field, val) => {
    setRules(prev => prev.map((r, i) => i === index ? { ...r, [field]: val } : r));
  };

  const handleApply = () => {
    if (onApplyRules) onApplyRules(rules);
    if (onRulesChange) onRulesChange(rules);
  };

  return (
    <div className="cond-format-editor">
      <h4>{t('condFormat.title')}</h4>
      {rules.map((rule, i) => (
        <div key={i} className="cond-format-rule">
          <select
            value={rule.operator}
            onChange={e => updateRule(i, 'operator', e.target.value)}
          >
            {OPERATORS.map(op => (
              <option key={op.value} value={op.value}>{t(op.label)}</option>
            ))}
          </select>
          <input
            type="number"
            value={rule.value}
            onChange={e => updateRule(i, 'value', e.target.value)}
            placeholder="0"
          />
          <div className="cond-format-colors">
            {COLOR_OPTIONS.map(c => (
              <button
                key={c.name}
                className={`cond-format-color${rule.color === c.name ? ' active' : ''}`}
                style={{ background: c.hex }}
                title={t(c.label)}
                onClick={() => updateRule(i, 'color', c.name)}
              />
            ))}
          </div>
          {rules.length > 1 && (
            <button className="btn btn--secondary" style={{ padding: '0.1rem 0.5rem' }} onClick={() => removeRule(i)}>×</button>
          )}
        </div>
      ))}
      <div className="cond-format-actions">
        <button className="btn btn--secondary" onClick={addRule}>{t('condFormat.addRule')}</button>
        <button className="btn btn--primary" onClick={handleApply}>{t('condFormat.apply')}</button>
      </div>
    </div>
  );
}
