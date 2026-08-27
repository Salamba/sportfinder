import { NavLink } from 'react-router-dom';
import Icon from './Icon';

export default function NavBar() {
  return (
    <div className="navbar">
      <NavLink to="/" end className={({ isActive }) => `navitem ${isActive ? 'active' : ''}`}>
        <Icon name="feed" />
        Лента
      </NavLink>
      <NavLink to="/clubs" className={({ isActive }) => `navitem ${isActive ? 'active' : ''}`}>
        <Icon name="clubs" />
        Клубы
      </NavLink>
      <NavLink to="/events/new" className="navitem">
        <div className="fab">
          <Icon name="plus" />
        </div>
      </NavLink>
      <NavLink to="/chats" className={({ isActive }) => `navitem ${isActive ? 'active' : ''}`}>
        <Icon name="chat" />
        Чаты
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `navitem ${isActive ? 'active' : ''}`}>
        <Icon name="profileNav" />
        Профиль
      </NavLink>
    </div>
  );
}
