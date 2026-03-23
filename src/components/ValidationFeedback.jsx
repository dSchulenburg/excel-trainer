import { useState } from 'react';
import { useI18n } from '../context/I18nContext';

export default function ValidationFeedback({ validationResult, onCheck, onSkip, allDone }) {
  const { t } = useI18n();
  const [skipConfirm, setSkipConfirm] = useState(false);

  return (
    <div className="validation-bar">
      {validationResult && (
        <span
          className={`validation-bar__status ${validationResult.passed ? 'validation-bar__status--success' : 'validation-bar__status--error'}`}
        >
          {validationResult.passed
            ? `${'✅'} ${t('exercise.allComplete')}`
            : `${'❌'} ${validationResult.errors} ${t('common.errors')}`}
        </span>
      )}
      <div style={{ flex: 1 }} />
      {skipConfirm ? (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: '#666' }}>{t('exercise.skipConfirm')}</span>
          <button className="btn btn--warning" onClick={onSkip} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            {t('common.yes')}
          </button>
          <button className="btn btn--secondary" onClick={() => setSkipConfirm(false)} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            {t('common.no')}
          </button>
        </div>
      ) : (
        <>
          {!allDone && (
            <button
              className="btn btn--ghost"
              onClick={() => setSkipConfirm(true)}
            >
              {t('exercise.skip')}
            </button>
          )}
          <button
            className={`btn ${allDone ? 'btn--success' : 'btn--primary'}`}
            onClick={onCheck}
          >
            {allDone ? `${'✓'} ${t('common.completed')}` : t('exercise.checkAnswer')}
          </button>
        </>
      )}
    </div>
  );
}
