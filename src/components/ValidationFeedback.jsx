import { useI18n } from '../context/I18nContext';

export default function ValidationFeedback({ validationResult, onCheck, allDone }) {
  const { t } = useI18n();

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
      <button
        className={`btn ${allDone ? 'btn--success' : 'btn--primary'}`}
        onClick={onCheck}
      >
        {allDone ? `${'✓'} ${t('common.completed')}` : t('exercise.checkAnswer')}
      </button>
    </div>
  );
}
