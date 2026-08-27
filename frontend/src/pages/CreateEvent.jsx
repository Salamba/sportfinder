import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import Icon, { sportIconName } from '../components/Icon';

export default function CreateEvent() {
  const [sports, setSports] = useState([]);
  const [form, setForm] = useState({
    title: '',
    sportId: 1,
    dateTime: '',
    location: '',
    maxPlayers: 10,
    level: 'any',
    description: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const fileInput = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.sports().then(setSports).catch(() => {});
  }, []);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  function onPickPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const created = await api.createEvent(form);
      if (photoFile) {
        const fd = new FormData();
        fd.append('photo', photoFile);
        await api.uploadEventPhoto(created.id, fd);
      }
      navigate(`/events/${created.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen">
      <div className="topbar">
        <div className="title">Создать</div>
        <div className="icon-btn" onClick={() => navigate('/')}>
          <Icon name="close" />
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <div className="form-label">Фото события</div>
          <label className={`photo-upload ${photoPreview ? 'filled' : ''}`}>
            {photoPreview ? (
              <img src={photoPreview} alt="Превью события" />
            ) : (
              <>
                <Icon name="camera" />
                <span>Добавить фото</span>
              </>
            )}
            <input ref={fileInput} type="file" accept="image/*" onChange={onPickPhoto} />
          </label>
        </div>

        <div className="form-group">
          <div className="form-label">Название события</div>
          <input className="form-input" value={form.title} onChange={update('title')} placeholder="Например, Вечерний матч на Vondelpark" required />
        </div>

        <div className="form-group">
          <div className="form-label">Вид спорта</div>
          <div className="sport-grid">
            {sports.map((s) => (
              <div
                key={s.id}
                className={`sport-pick ${Number(form.sportId) === s.id ? 'on' : ''}`}
                onClick={() => setForm({ ...form, sportId: s.id })}
              >
                <Icon name={sportIconName(s.name)} />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">Дата и время</div>
          <input className="form-input" type="datetime-local" value={form.dateTime} onChange={update('dateTime')} required />
        </div>

        <div className="form-group">
          <div className="form-label">Место</div>
          <input className="form-input" value={form.location} onChange={update('location')} placeholder="Адрес или название площадки" required />
        </div>

        <div className="form-group">
          <div className="form-label">Число игроков</div>
          <div className="stepper">
            <button type="button" onClick={() => setForm({ ...form, maxPlayers: Math.max(2, form.maxPlayers - 1) })}>
              –
            </button>
            <div className="val">{form.maxPlayers}</div>
            <button type="button" onClick={() => setForm({ ...form, maxPlayers: Math.min(30, Number(form.maxPlayers) + 1) })}>
              +
            </button>
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">Уровень игры</div>
          <select className="form-select" value={form.level} onChange={update('level')}>
            <option value="any">Любой</option>
            <option value="medium">Средний</option>
            <option value="advanced">Продвинутый</option>
          </select>
        </div>

        <div className="form-group">
          <div className="form-label">Описание</div>
          <input className="form-input" value={form.description} onChange={update('description')} placeholder="Детали для участников" />
        </div>

        <button className="btn" type="submit" disabled={busy}>
          <Icon name="check" />
          {busy ? 'Публикуем…' : 'Опубликовать событие'}
        </button>
      </form>
    </div>
  );
}
