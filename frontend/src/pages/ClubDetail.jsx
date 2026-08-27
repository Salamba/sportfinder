import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import Icon, { sportIconName } from '../components/Icon';

export default function ClubDetail() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      setClub(await api.club(id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleJoin() {
    setBusy(true);
    try {
      await api.joinClub(id);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (error) return <div className="error-banner">{error}</div>;
  if (!club) return <div className="loading-state">Загружаем клуб…</div>;

  return (
    <div className="screen">
      <div className="back-row">
        <div className="icon-btn" onClick={() => navigate(-1)}>
          <Icon name="back" />
        </div>
        <div className="title">Клуб</div>
      </div>

      <div className="profile-hero">
        <div className="club-logo" style={{ width: 72, height: 72, fontSize: 24, marginBottom: 8 }}>
          {club.photoUrl ? <img src={club.photoUrl} alt="" /> : club.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="profile-name">{club.name}</div>
        <div className="profile-sub">
          <Icon name={sportIconName(club.sport?.name)} style={{ width: 12, height: 12 }} /> {club.sport?.name} ·{' '}
          {club.city} · {club.memberCount} участников
        </div>
        <div className="role-pills">
          {club.isOrganizer ? (
            <span className="pill organizer">
              <Icon name="check" />
              Вы — Организатор клуба
            </span>
          ) : club.isMember ? (
            <span className="pill player">Вы состоите в клубе</span>
          ) : (
            <button className="btn" style={{ margin: '6px 0 0', width: 'auto', padding: '8px 18px' }} onClick={handleJoin} disabled={busy}>
              Вступить в клуб
            </button>
          )}
        </div>
      </div>

      <div className="section-label">Ближайшие события клуба</div>
      {club.events.length === 0 && <div className="empty-state">Событий пока нет.</div>}
      <div className="list">
        {club.events.map((ev) => (
          <Link to={`/events/${ev.id}`} key={ev.id} className="card">
            <div className="sport-badge">
              <Icon name={sportIconName(club.sport?.name)} />
              {club.sport?.name}
            </div>
            <div className="card-title">{ev.title}</div>
            <div className="card-meta">
              <Icon name="clock" />
              {new Date(ev.date_time).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </div>
          </Link>
        ))}
      </div>

      <div className="section-label">Участники</div>
      <div className="roster-list" style={{ paddingBottom: 20 }}>
        {club.members.map((m) => (
          <div className="player-row" key={m.id}>
            <div className="avatar">{m.photo_url ? <img src={m.photo_url} alt="" /> : m.name.charAt(0).toUpperCase()}</div>
            <div className="player-name">
              {m.name}
              {m.id === club.organizer.id && <span className="role-tag organizer">Организатор</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
