import { useI18n } from '../../context/I18nContext';
import { BADGE_DEFS } from '../../context/GameContext';

export default function Badge({ badgeId, earned = false }) {
  const { t } = useI18n();
  const def = BADGE_DEFS[badgeId];
  if (!def) return null;

  return (
    <div className={`badge-card ${earned ? '' : 'badge-card--locked'}`}>
      <div className="badge-card__icon">{def.icon}</div>
      <div className="badge-card__name">{t(def.titleKey)}</div>
    </div>
  );
}
