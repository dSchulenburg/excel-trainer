import { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useGame } from '../context/GameContext';
import { getPlayerLevel } from '../utils/xp';
import { exercises } from '../exercises';

const AVATARS = ['🧑‍💻', '👩‍💻', '🧑‍🎓', '👨‍🎓', '🦸', '🦸‍♀️', '🧙', '🧑‍🚀'];

export default function ProfileCard() {
  const { t } = useI18n();
  const { playerName, avatarId, xp, badges, exerciseResults, streak, setProfile, resetProgress } = useGame();
  const [name, setName] = useState(playerName);
  const [avatar, setAvatar] = useState(avatarId);
  const playerLevel = getPlayerLevel(xp);

  const completedCount = Object.keys(exerciseResults).length;
  const totalExercises = exercises.length;

  const handleSave = () => {
    setProfile(name, avatar);
  };

  return (
    <div className="profile">
      <h1 className="profile__title">{t('profile.title')}</h1>
      <div className="profile__card">
        <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{t('profile.chooseAvatar')}</p>
        <div className="avatar-grid">
          {AVATARS.map((a, i) => (
            <button
              key={i}
              className={`avatar-btn ${avatar === i ? 'avatar-btn--selected' : ''}`}
              onClick={() => setAvatar(i)}
            >
              {a}
            </button>
          ))}
        </div>
        <input
          className="profile__input"
          placeholder={t('profile.enterName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn--primary" onClick={handleSave} style={{ width: '100%' }}>
          {t('common.save')}
        </button>

        <div className="profile__stats">
          <div className="stat-card">
            <div className="stat-card__value">{xp}</div>
            <div className="stat-card__label">XP</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{t(playerLevel.titleKey)}</div>
            <div className="stat-card__label">{t('common.level')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{completedCount}/{totalExercises}</div>
            <div className="stat-card__label">{t('common.completed')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{badges.length}</div>
            <div className="stat-card__label">{t('nav.badges')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{'🔥'} {streak.count}</div>
            <div className="stat-card__label">{t('common.streak')}</div>
          </div>
        </div>

        <button
          className="btn btn--secondary"
          onClick={() => {
            if (window.confirm('Wirklich allen Fortschritt loeschen?')) resetProgress();
          }}
          style={{ width: '100%', marginTop: '1rem', fontSize: '0.8rem' }}
        >
          {t('common.reset')}
        </button>
      </div>
    </div>
  );
}
