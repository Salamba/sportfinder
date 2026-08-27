import { Link, useLocation } from 'react-router-dom';
import './MobileNav.css';

export default function MobileNav() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <Link to="/" className={`navitem ${isActive('/') ? 'active' : ''}`} id="nav-feed">
        <svg viewBox="0 0 24 24">
          <circle cx="4.2" cy="6" r="1.1" fill="currentColor" stroke="none"/>
          <circle cx="4.2" cy="12" r="1.1" fill="currentColor" stroke="none"/>
          <circle cx="4.2" cy="18" r="1.1" fill="currentColor" stroke="none"/>
          <path d="M8 6h12M8 12h12M8 18h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
        <span>Лента</span>
      </Link>

      <Link to="/clubs" className={`navitem ${isActive('/clubs') ? 'active' : ''}`} id="nav-clubs">
        <svg viewBox="0 0 24 24">
          <circle cx="9" cy="8.2" r="3" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M3.2 20c0-3.4 2.6-6 5.8-6s5.8 2.6 5.8 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
          <circle cx="17.3" cy="9.4" r="2.2" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M15.7 14.4c2.5.5 4.3 2.6 4.3 5.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
        <span>Клубы</span>
      </Link>

      <Link to="/events/new" className="navitem">
        <div className="fab">
          <svg viewBox="0 0 24 24">
            <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
      </Link>

      <Link to="/chats" className={`navitem ${isActive('/chats') ? 'active' : ''}`} id="nav-chats">
        <svg viewBox="0 0 24 24">
          <path d="M4 5.5h16v10.2H9.3L5 19.5v-3.8H4z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Чаты</span>
      </Link>

      <Link to="/profile" className={`navitem ${isActive('/profile') ? 'active' : ''}`} id="nav-profile">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="8.2" r="3.6" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M4.5 20c0-4.1 3.4-7.4 7.5-7.4s7.5 3.3 7.5 7.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
        <span>Профиль</span>
      </Link>
    </nav>
  );
}