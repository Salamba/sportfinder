import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import Icon, { sportIconName } from '../components/Icon';

const ROLE_LABEL = { player: 'Игрок', organizer: 'Организатор', admin: 'Администратор' };

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  if (!user) return <div className="loading-state">Загружаем профиль…</div>;

  async function onPickPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('photo', file);
    try {
      await api.uploadMyPhoto(fd);
      await refreshUser();
    } finally {
      setUploading(false);
    }
  }

  function onLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="screen">
      <div className="topbar">
        <div className="title">Профиль</div>
        <div className="icon-btn">
          <Icon name="settings" />
        </div>
      </div>

      <div className="profile-hero">
        <div className="avatar-wrap">
          <div className="profile-avatar">
            {user.photoUrl ? <img src={user.photoUrl} alt="" /> : user.name.charAt(0).toUpperCase()}
          </div>
          <div className="photo-edit-btn" onClick={() => fileInput.current?.click()}>
            <Icon name="camera" />
          </div>
          <input ref={fileInput} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPickPhoto} />
        </div>
        {uploading && <div style={{ fontSize: 12, color: 'var(--chalk-dim)' }}>Загружаем фото…</div>}
        <div className="profile-name">{user.name}</div>
        <div className="profile-sub">{user.city || 'Город не указан'}</div>
        <div className="role-pills">
          {user.roles.map((r) => (
            <span key={r} className={`pill ${r}`}>
              {ROLE_LABEL[r] || r}
            </span>
          ))}
        </div>
      </div>

      <div className="stat-strip">
        <div className="stat">
          <div className="num">{user.gamesPlayed ?? 0}</div>
          <div className="lbl">игр сыграно</div>
        </div>
        <div className="stat">
          <div className="num">{user.rating ? user.rating.toFixed(1) : '—'}</div>
          <div className="lbl">рейтинг</div>
        </div>
      </div>

      {user.sports && user.sports.length > 0 && (
        <>
          <div className="section-label">Виды спорта</div>
          <div className="sport-tag-row">
            {user.sports.map((s) => (
              <span className="pill" key={s.id}>
                <Icon name={sportIconName(s.name)} />
                {s.name}
              </span>
            ))}
          </div>
        </>
      )}

      <button className="btn secondary" style={{ marginTop: 24 }} onClick={onLogout}>
        Выйти из аккаунта
      </button>
    </div>
  );
}
