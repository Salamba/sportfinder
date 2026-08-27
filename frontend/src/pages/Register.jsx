import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { token, user } = await api.register(form);
      login(token, user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-screen">
      <h1>Регистрация</h1>
      <p className="sub">Базовая роль «Игрок» выдаётся сразу — Организатором вы станете, создав первое событие.</p>
      {error && <div className="error-banner">{error}</div>}
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input className="form-input" placeholder="Имя" value={form.name} onChange={update('name')} required />
        <input className="form-input" type="email" placeholder="Email" value={form.email} onChange={update('email')} required />
        <input
          className="form-input"
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={update('password')}
          required
        />
        <input className="form-input" placeholder="Город" value={form.city} onChange={update('city')} />
        <button className="btn" type="submit" disabled={busy} style={{ width: '100%', margin: 0 }}>
          {busy ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
        </button>
      </form>
      <p className="auth-link">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}
