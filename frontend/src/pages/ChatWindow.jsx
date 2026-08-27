import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import Icon from '../components/Icon';
import { useAuth } from '../auth';

export default function ChatWindow() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    load();
    // MVP: обновляем сообщения поллингом. В продакшене — WebSocket/SSE.
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function load() {
    try {
      setMessages(await api.messages(id));
    } catch {
      // тред мог быть удалён — молча игнорируем в MVP
    }
  }

  async function onSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const body = text;
    setText('');
    await api.sendMessage(id, body);
    load();
  }

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="back-row">
        <div className="icon-btn" onClick={() => navigate('/chats')}>
          <Icon name="back" />
        </div>
        <div className="title">Чат</div>
      </div>
      <div style={{ flex: 1 }}>
        {messages.map((m) => (
          <div className={`bubble-row ${m.sender_id === user?.id ? 'me' : ''}`} key={m.id}>
            <div className={`bubble ${m.sender_id === user?.id ? 'me' : 'them'}`}>
              {m.sender_id !== user?.id && <b>{m.sender_name}: </b>}
              {m.body}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="chat-input-row" onSubmit={onSend}>
        <input placeholder="Написать сообщение..." value={text} onChange={(e) => setText(e.target.value)} />
        <button className="send-btn" type="submit">
          <Icon name="send" />
        </button>
      </form>
    </div>
  );
}
