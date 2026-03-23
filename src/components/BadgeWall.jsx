import { motion } from 'framer-motion';
import { useI18n } from '../context/I18nContext';
import { useGame, BADGE_DEFS } from '../context/GameContext';
import Badge from './ui/Badge';

const GENERIC_BADGES = [
  'first-cell',
  'first-formula',
  'sum-master',
  'streak-3',
  'perfect-score',
  'speed-demon',
  'polyglot',
];

const TRACK_BADGES = {
  avm: ['shopping-done', 'alltag-done', 'cooking-master', 'finance-pro', 'travel-expert', 'pro-complete'],
  kaufleute: [
    'referenz-meister',
    'entscheider',
    'sverweis-meister',
    'daten-profi',
    'visualisierer',
    'chart-creator',
    'geschaeftsfuehrer',
    'kaufmann-komplett',
  ],
};

export default function BadgeWall() {
  const { t } = useI18n();
  const { badges, selectedTrack } = useGame();
  const visibleBadgeIds = [
    ...GENERIC_BADGES,
    ...(TRACK_BADGES[selectedTrack] || []),
  ].filter((id) => id in BADGE_DEFS);

  return (
    <div className="badge-wall">
      <h1 className="badge-wall__title">{t('badges.title')}</h1>
      <div className="badge-grid">
        {visibleBadgeIds.map((id, index) => (
          <motion.div
            key={id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              delay: index * 0.08,
            }}
            whileHover={{ y: -4 }}
          >
            <Badge badgeId={id} earned={badges.includes(id)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
