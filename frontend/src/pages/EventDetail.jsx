import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import Icon, { sportIconName } from '../components/Icon';
import { useAuth } from '../auth';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      setEvent(await api.event(id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleJoin() {
    setBusy(true);
    try {
      setEvent(await api.joinEvent(id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleOpenThread() {
    // MVP: у события ровно один тред — переходим в общий список чатов и просим открыть его там
    navigate('/chats');
  }

  async function handleCancel() {
    if (!confirm('Отменить событие?')) return;
    await api.cancelEvent(id);
    navigate('/');
  }

  if (error) return <div className="error-banner">{error}</div>;
  if (!event) return <div className="loading-state">Загружаем событие…</div>;

  const slots = Array.from({ length: event.maxPlayers }, (_, i) => event.participants[i] || null);

  return (
    <div className="screen">
      <div className="back-row">
        <div className="icon-btn" onClick={() => navigate(-1)}>
          <Icon name="back" />
        </div>
        <div className="title">Событие</div>
      </div>

      <div className="hero-strip" style={event.photoUrl ? { backgroundImage: `url(${event.photoUrl})` } : undefined}>
        <div className="badge">
          <Icon name={sportIconName(event.sport?.name)} />
          {event.sport?.name}
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div className="card-title" style={{ fontSize: 26 }}>
          {event.title}
        </div>
      </div>
      <div className="info-row">
        <Icon name="clock" /> {new Date(event.dateTime).toLocaleString('ru-RU')}
      </div>
      <div className="info-row">
        <Icon name="pin" /> {event.location}
      </div>
      <div className="info-row">
        <Icon name="signal" /> Уровень: {event.level}
      </div>
      {event.description && (
        <div className="info-row">
          <Icon name="chat" /> «{event.description}»
        </div>
      )}

      <div className="section-label">
        Состав · {event.filledSlots}/{event.maxPlayers}
      </div>
      <div className="roster-list">
        {slots.map((p, i) =>
          p ? (
            <div className="player-row" key={p.id}>
              <div className="avatar">{p.photo_url ? <img src={p.photo_url} alt="" /> : initials(p.name)}</div>
              <div className="player-name">
                {p.name}
                {p.id === event.organizer.id && <span className="role-tag organizer">Организатор</span>}
              </div>
            </div>
          ) : (
            <div className="player-row" key={`empty-${i}`}>
              <div className="empty-slot" />
              <div className="player-name" style={{ color: 'var(--chalk-dim)' }}>
                свободно
              </div>
            </div>
          )
        )}
      </div>

      {!event.isParticipant && event.status === 'open' && (
        <button className="btn" onClick={handleJoin} disabled={busy}>
          <Icon name="check" />
          Откликнуться
        </button>
      )}
      {event.isParticipant && (
        <button className="btn secondary" onClick={handleOpenThread}>
          <Icon name="chat" />
          Открыть чат события
        </button>
      )}
      {event.isOrganizer && (
        <button className="btn secondary" onClick={handleCancel} style={{ color: '#C1400E' }}>
          Отменить событие
        </button>
      )}
    </div>
  );
}

function initials(name) {
  return (name || '?').trim().charAt(0).toUpperCase();
}
