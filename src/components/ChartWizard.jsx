import { useState, Suspense, lazy } from 'react';
import { useI18n } from '../context/I18nContext';
import { extractChartData } from '../utils/chartUtils';

const ChartPreview = lazy(() => import('./ChartPreview'));

const CHART_TYPES = [
  { id: 'bar', icon: '📊', labelKey: 'chart.bar' },
  { id: 'line', icon: '📈', labelKey: 'chart.line' },
  { id: 'pie', icon: '🥧', labelKey: 'chart.pie' },
];

function parseRange(range) {
  // "B2:B6" → { startRow: 1, endRow: 5, col: 1 }
  const match = range.match(/^([A-Z])(\d+):([A-Z])(\d+)$/i);
  if (!match) return null;
  return {
    col: match[1].toUpperCase().charCodeAt(0) - 65,
    startRow: parseInt(match[2]) - 1,
    endRow: parseInt(match[4]) - 1,
  };
}

export default function ChartWizard({ sheetData, onComplete }) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    chartType: null,
    dataRange: '',
    labelRange: '',
    title: '',
  });

  const previewData = (() => {
    if (step !== 2) return null;
    const dr = parseRange(config.dataRange);
    const lr = config.labelRange ? parseRange(config.labelRange) : null;
    if (!dr) return null;
    return extractChartData(sheetData, dr, lr);
  })();

  const handleFinish = () => {
    const dr = parseRange(config.dataRange);
    const lr = config.labelRange ? parseRange(config.labelRange) : null;
    if (!dr) return;
    onComplete({
      chartType: config.chartType,
      dataRange: dr,
      labelRange: lr,
      title: config.title,
      data: extractChartData(sheetData, dr, lr),
    });
  };

  return (
    <div className="chart-wizard">
      <h3 style={{ color: '#003366', marginBottom: '0.5rem' }}>{t('chart.title')}</h3>

      {/* Step 0: Choose chart type */}
      {step === 0 && (
        <>
          <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.25rem' }}>{t('chart.selectType')}</p>
          <div className="chart-wizard__types">
            {CHART_TYPES.map(ct => (
              <button
                key={ct.id}
                className={`chart-type-btn${config.chartType === ct.id ? ' active' : ''}`}
                onClick={() => setConfig(c => ({ ...c, chartType: ct.id }))}
              >
                <span className="chart-type-btn__icon">{ct.icon}</span>
                <span style={{ fontSize: '0.8rem' }}>{t(ct.labelKey)}</span>
              </button>
            ))}
          </div>
          <div className="chart-wizard__actions">
            <button
              className="btn btn--primary"
              onClick={() => setStep(1)}
              disabled={!config.chartType}
            >
              {t('chart.next')}
            </button>
          </div>
        </>
      )}

      {/* Step 1: Enter data range + label range */}
      {step === 1 && (
        <>
          <div className="chart-wizard__inputs">
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{t('chart.dataRange')}</label>
            <input
              type="text"
              value={config.dataRange}
              onChange={e => setConfig(c => ({ ...c, dataRange: e.target.value }))}
              placeholder="B2:B6"
            />
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{t('chart.labelRange')}</label>
            <input
              type="text"
              value={config.labelRange}
              onChange={e => setConfig(c => ({ ...c, labelRange: e.target.value }))}
              placeholder="A2:A6"
            />
          </div>
          <div className="chart-wizard__actions">
            <button className="btn btn--secondary" onClick={() => setStep(0)}>{t('chart.back')}</button>
            <button
              className="btn btn--primary"
              onClick={() => setStep(2)}
              disabled={!parseRange(config.dataRange)}
            >
              {t('chart.next')}
            </button>
          </div>
        </>
      )}

      {/* Step 2: Title + preview + confirm */}
      {step === 2 && (
        <>
          <div className="chart-wizard__inputs">
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{t('chart.chartTitle')}</label>
            <input
              type="text"
              value={config.title}
              onChange={e => setConfig(c => ({ ...c, title: e.target.value }))}
              placeholder={t('chart.chartTitle')}
            />
          </div>
          <div className="chart-wizard__preview">
            <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '0.5rem' }}>{t('chart.preview')}</p>
            <Suspense fallback={<div style={{ padding: '1rem', color: '#999' }}>...</div>}>
              <ChartPreview
                chartType={config.chartType}
                data={previewData}
                title={config.title}
              />
            </Suspense>
          </div>
          <div className="chart-wizard__actions">
            <button className="btn btn--secondary" onClick={() => setStep(1)}>{t('chart.back')}</button>
            <button
              className="btn btn--primary"
              onClick={handleFinish}
              disabled={!previewData?.length}
            >
              {t('chart.finish')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
