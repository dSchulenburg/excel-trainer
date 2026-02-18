import { motion } from 'framer-motion';

export default function XPPopup({ xp }) {
  if (!xp) return null;

  return (
    <motion.div
      className="xp-popup"
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: [0, 1, 1, 0], y: [20, 0, -30, -60], scale: [0.8, 1.1, 1, 0.9] }}
      transition={{ duration: 1.8, times: [0, 0.15, 0.7, 1] }}
    >
      +{xp} XP
    </motion.div>
  );
}
