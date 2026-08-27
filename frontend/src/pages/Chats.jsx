import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Icon from '../components/Icon';

export default function Chats() {
  const [threads, setThreads] = useState(null);

  useEffect(() => {
    api.threads().then(setThreads).catch(() => setThreads([]));
  }, []);

  return (
    <div className="screen">
      <div className="topbar">
        <div className="title">Чаты</div>
      </div>
      {threads && threads.length === 0 && <div className="empty-state">Пока нет чатов — они появляются, когда вы присоединяетесь к событию или клубу.</div>}
      {threads &&
        threads.map((t) => (
          <Link to={`/chats/${t.id}`} key={t.id} className="chat-row">
            <div className="thread-icon">
              <Icon name={t.type === 'club' ? 'clubs' : 'chat'} />
            </div>
            <div>
              <div className="name">{t.title || (t.type === 'event' ? 'Событие' : 'Клуб')}</div>
              <div className="preview">{t.lastMessage || 'Ещё нет сообщений'}</div>
            </div>
            {t.lastMessageAt && <div className="time">{new Date(t.lastMessageAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>}
          </Link>
        ))}
    </div>
  );
}
