import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Попытка входа:', email);
      await login(email, password);
      console.log('✅ Успешный вход!');
      navigate('/');
    } catch (err) {
      console.error('❌ Ошибка входа:', err);
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '40px auto', 
      padding: '20px',
      background: '#183A30',
      borderRadius: '16px',
      border: '1px solid #2A4238',
      color: '#F1EDE4',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '32px', marginBottom: '8px', fontWeight: '400' }}>🏐 SportFinder</h1>
      <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Вход</h2>

      {error && (
        <div style={{ 
          background: 'rgba(255, 107, 107, 0.15)', 
          border: '1px solid #FF6B6B',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '16px',
          color: '#FF6B6B',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#B9C4BD', marginBottom: '4px', fontWeight: '600' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              width: '100%',
              padding: '10px 14px',
              background: '#0F231C',
              border: '1px solid #2A4238',
              borderRadius: '10px',
              color: '#F1EDE4',
              fontSize: '14px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#B9C4BD', marginBottom: '4px', fontWeight: '600' }}>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '10px 14px',
              background: '#0F231C',
              border: '1px solid #2A4238',
              borderRadius: '10px',
              color: '#F1EDE4',
              fontSize: '14px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#B8FF3D',
            color: '#0F231C',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <p style={{ marginTop: '16px', fontSize: '14px', color: '#B9C4BD' }}>
        Нет аккаунта? <Link to="/register" style={{ color: '#B8FF3D', textDecoration: 'none' }}>Зарегистрироваться</Link>
      </p>

      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #2A4238' }}>
        <p style={{ fontSize: '12px', color: '#B9C4BD', marginBottom: '8px', fontWeight: '600' }}>Демо-аккаунты (пароль: password123):</p>
        <button 
          onClick={() => { setEmail('viktor@example.com'); setPassword('password123'); }}
          style={{
            display: 'block',
            width: '100%',
            padding: '8px 12px',
            marginBottom: '6px',
            background: '#0F231C',
            border: '1px solid #2A4238',
            borderRadius: '8px',
            color: '#F1EDE4',
            cursor: 'pointer',
            fontSize: '13px',
            textAlign: 'left',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#1a3a30'}
          onMouseLeave={(e) => e.target.style.background = '#0F231C'}
        >
          👑 Viktor (Admin) — viktor@example.com
        </button>
        <button 
          onClick={() => { setEmail('daan@example.com'); setPassword('password123'); }}
          style={{
            display: 'block',
            width: '100%',
            padding: '8px 12px',
            marginBottom: '6px',
            background: '#0F231C',
            border: '1px solid #2A4238',
            borderRadius: '8px',
            color: '#F1EDE4',
            cursor: 'pointer',
            fontSize: '13px',
            textAlign: 'left',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#1a3a30'}
          onMouseLeave={(e) => e.target.style.background = '#0F231C'}
        >
          🏆 Daan (Organizer) — daan@example.com
        </button>
        <button 
          onClick={() => { setEmail('mila@example.com'); setPassword('password123'); }}
          style={{
            display: 'block',
            width: '100%',
            padding: '8px 12px',
            background: '#0F231C',
            border: '1px solid #2A4238',
            borderRadius: '8px',
            color: '#F1EDE4',
            cursor: 'pointer',
            fontSize: '13px',
            textAlign: 'left',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#1a3a30'}
          onMouseLeave={(e) => e.target.style.background = '#0F231C'}
        >
          ⚽ Mila (Player) — mila@example.com
        </button>
      </div>
    </div>
  );
}