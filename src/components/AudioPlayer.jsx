import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../context/I18nContext';

/**
 * AudioPlayer — Navy-gradient audio player for learning modules.
 *
 * Reusable component designed to work across all learning modules.
 * Loads audio from /public/audio/{lang}/{src}.mp3 based on current i18n language.
 *
 * @param {string} src - Audio filename without extension and lang prefix, e.g. "level1-intro"
 * @param {string} [label] - Optional label displayed next to play button
 * @param {boolean} [compact=false] - Compact mode for exercise headers
 */
export default function AudioPlayer({ src, label, compact = false }) {
  const { lang } = useI18n();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const progressRef = useRef(null);

  const audioUrl = `${import.meta.env.BASE_URL}audio/${lang}/${src}.mp3`;

  // Reset state when src or lang changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setIsLoaded(false);
    setHasError(false);
  }, [src, lang]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoaded(true);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      const t = audioRef.current.currentTime;
      const d = audioRef.current.duration;
      setCurrentTime(t);
      setProgress(d > 0 ? (t / d) * 100 : 0);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || hasError) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setHasError(true);
      });
    }
  }, [isPlaying, hasError]);

  const handleProgressClick = useCallback((e) => {
    if (!audioRef.current || !progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    audioRef.current.currentTime = pct * duration;
  }, [duration]);

  const formatTime = (seconds) => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Don't render if audio file doesn't exist (fail silently)
  if (hasError) return null;

  if (compact) {
    return (
      <div style={styles.compactWrapper}>
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={handleError}
        />
        <motion.button
          style={styles.compactBtn}
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isPlaying ? 'Pause' : 'Abspielen'}
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          )}
        </motion.button>
        {label && <span style={styles.compactLabel}>{label}</span>}
        {isPlaying && (
          <div style={styles.compactProgress} ref={progressRef} onClick={handleProgressClick}>
            <motion.div
              style={{ ...styles.compactProgressFill, width: `${progress}%` }}
              initial={false}
              animate={{ width: `${progress}%` }}
            />
          </div>
        )}
        {isPlaying && (
          <span style={styles.compactTime}>{formatTime(currentTime)}</span>
        )}
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
      />
      <div style={styles.player}>
        <motion.button
          style={styles.playBtn}
          onClick={togglePlay}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.svg
                key="pause"
                width="18" height="18" viewBox="0 0 24 24" fill="white"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </motion.svg>
            ) : (
              <motion.svg
                key="play"
                width="18" height="18" viewBox="0 0 24 24" fill="white"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <polygon points="6,4 20,12 6,20" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>

        <div style={styles.trackArea}>
          {label && <div style={styles.label}>{label}</div>}
          <div style={styles.progressBar} ref={progressRef} onClick={handleProgressClick}>
            <motion.div
              style={styles.progressFill}
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        <div style={styles.time}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}

const styles = {
  // --- Full Player ---
  wrapper: {
    marginBottom: '0.75rem',
  },
  player: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    background: 'linear-gradient(135deg, #003366 0%, #004488 60%, #00537a 100%)',
    borderRadius: '8px',
    padding: '0.5rem 0.75rem',
    boxShadow: '0 2px 8px rgba(0,51,102,0.25)',
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.15)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.2s',
  },
  trackArea: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  label: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '0.75rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  progressBar: {
    height: 6,
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    cursor: 'pointer',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00A3E0, #B5E505)',
    borderRadius: 3,
  },
  time: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.7rem',
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  // --- Compact Player ---
  compactWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  compactBtn: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #003366, #004488)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 1px 4px rgba(0,51,102,0.3)',
  },
  compactLabel: {
    color: '#003366',
    fontSize: '0.75rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  compactProgress: {
    flex: 1,
    height: 4,
    background: 'rgba(0,51,102,0.1)',
    borderRadius: 2,
    cursor: 'pointer',
    overflow: 'hidden',
    minWidth: 40,
  },
  compactProgressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00A3E0, #B5E505)',
    borderRadius: 2,
  },
  compactTime: {
    color: '#666',
    fontSize: '0.65rem',
    fontVariantNumeric: 'tabular-nums',
    flexShrink: 0,
  },
};
