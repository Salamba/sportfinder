import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Icon, { sportIconName } from '../components/Icon';

export default function Clubs() {
  const [clubs, setClubs] = useState(null);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setClubs(await api.clubs());
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="screen">
      <div className="topbar">
        <div className="title">Клубы</div>
        <div className="icon-btn" onClick={() => setShowCreate((v) => !v)}>
          <Icon name={showCreate ? 'close' : 'plus'} />
        </div>
      </div>

      {showCreate && <CreateClubForm onCreated={() => { setShowCreate(false); load(); }} />}
      {error && <div className="error-banner">{error}</div>}
      {clubs && clubs.length === 0 && <div className="empty-state">Клубов пока нет — создайте первый.</div>}

      <div className="list">
        {clubs &&
          clubs.map((c) => (
            <Link to={`/clubs/${c.id}`} key={c.id} className="club-card">
              <div className="club-logo">{c.photoUrl ? <img src={c.photoUrl} alt="" /> : c.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <div className="club-name">{c.name}</div>
                <div className="club-meta">
                  <Icon name={sportIconName(c.sport?.name)} />
                  {c.sport?.name} · {c.memberCount} участников{c.isOrganizer ? ' · вы Организатор' : ''}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

function CreateClubForm({ onCreated }) {
  const [sports, setSports] = useState([]);
  const [form, setForm] = useState({ name: '', sportId: 1, city: '', description: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.sports().then(setSports).catch(() => {});
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.createClub(form);
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ padding: '0 16px 16px' }}>
      {error && <div className="error-banner">{error}</div>}
      <div className="form-group" style={{ padding: '0 0 10px' }}>
        <input className="form-input" placeholder="Название клуба" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div className="form-group" style={{ padding: '0 0 10px' }}>
        <select className="form-select" value={form.sportId} onChange={(e) => setForm({ ...form, sportId: Number(e.target.value) })}>
          {sports.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group" style={{ padding: '0 0 10px' }}>
        <input className="form-input" placeholder="Город" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
      </div>
      <button className="btn" style={{ margin: 0, width: '100%' }} disabled={busy}>
        {busy ? 'Создаём…' : 'Создать клуб'}
      </button>
    </form>
  );
}
