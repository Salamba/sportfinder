import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Icon, { sportIconName } from '../components/Icon';
import RosterTally from '../components/RosterTally';

const SPORT_FILTERS = [
  { id: null, name: 'Все виды' },
  { id: 1, name: 'Футбол' },
  { id: 2, name: 'Баскетбол' },
  { id: 3, name: 'Теннис' },
  { id: 4, name: 'Волейбол' },
];

export default function Feed() {
  const [events, setEvents] = useState(null);
  const [activeSport, setActiveSport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, [activeSport]);

  async function load() {
    try {
      const query = activeSport ? `?sport=${activeSport}` : '';
      setEvents(await api.events(query));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="screen">
      <div className="topbar">
        <div>
          <div className="eyebrow-brand">
            <Icon name="logo" style={{ width: 12, height: 12 }} />
            SportFinder
          </div>
          <div className="title">Лента</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="icon-btn">
            <Icon name="pin" />
          </div>
          <div className="icon-btn">
            <Icon name="bell" />
            <span className="ping" />
          </div>
        </div>
      </div>

      <div className="filters">
        {SPORT_FILTERS.map((s) => (
          <button
            key={s.id ?? 'all'}
            className={`chip ${activeSport === s.id ? 'on' : ''}`}
            onClick={() => setActiveSport(s.id)}
          >
            {s.id && <Icon name={sportIconName(s.name)} />}
            {s.name}
          </button>
        ))}
      </div>

      {error && <div className="error-banner">{error}</div>}
      {!events && !error && <div className="loading-state">Загружаем события…</div>}
      {events && events.length === 0 && <div className="empty-state">Пока нет событий — создайте первое через кнопку «+».</div>}

      <div className="list">
        {events &&
          events.map((ev) => (
            <Link to={`/events/${ev.id}`} key={ev.id} className="card">
              <span className="lvl">{levelLabel(ev.level)}</span>
              <div className="sport-badge">
                <Icon name={sportIconName(ev.sport?.name)} />
                {ev.sport?.name}
              </div>
              <div className="card-title">{ev.title}</div>
              <div className="card-meta">
                <Icon name="clock" />
                {formatDate(ev.dateTime)}
                <span className="dotsep" />
                <Icon name="pin" />
                {ev.location}
                <span className="dotsep" />
                Организатор {ev.organizer?.name}
              </div>
              <RosterTally filled={ev.filledSlots} total={ev.maxPlayers} />
            </Link>
          ))}
      </div>
    </div>
  );
}

function levelLabel(level) {
  return { any: 'любой', medium: 'средний', advanced: 'продвинутый' }[level] || level;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}
