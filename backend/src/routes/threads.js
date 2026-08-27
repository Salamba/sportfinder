const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Треды, в которых пользователь участвует — по событиям и клубам, где он состоит
router.get('/', requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT t.id, t.type, t.event_id, t.club_id,
              e.title AS event_title, c.name AS club_name
       FROM threads t
       LEFT JOIN events e ON e.id = t.event_id
       LEFT JOIN club_members cm_check ON cm_check.club_id = t.club_id AND cm_check.user_id = ?
       LEFT JOIN event_participants ep_check ON ep_check.event_id = t.event_id AND ep_check.user_id = ?
       LEFT JOIN clubs c ON c.id = t.club_id
       WHERE (t.type = 'event' AND ep_check.user_id IS NOT NULL)
          OR (t.type = 'club' AND cm_check.user_id IS NOT NULL)
       ORDER BY t.id DESC`
    )
    .all(req.userId, req.userId);

  const withLastMessage = rows.map((t) => {
    const last = db
      .prepare('SELECT body, created_at FROM messages WHERE thread_id = ? ORDER BY id DESC LIMIT 1')
      .get(t.id);
    return {
      id: t.id,
      type: t.type,
      title: t.type === 'event' ? t.event_title : t.club_name,
      lastMessage: last ? last.body : null,
      lastMessageAt: last ? last.created_at : null,
    };
  });
  res.json(withLastMessage);
});

router.get('/:id/messages', requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT m.id, m.body, m.created_at, u.id AS sender_id, u.name AS sender_name
       FROM messages m JOIN users u ON u.id = m.sender_id
       WHERE m.thread_id = ? ORDER BY m.id ASC`
    )
    .all(req.params.id);
  res.json(rows);
});

router.post('/:id/messages', requireAuth, (req, res) => {
  const { body } = req.body;
  if (!body || !body.trim()) return res.status(400).json({ error: 'Сообщение не может быть пустым' });
  const info = db
    .prepare('INSERT INTO messages (thread_id, sender_id, body) VALUES (?, ?, ?)')
    .run(req.params.id, req.userId, body.trim());
  const message = db
    .prepare(
      `SELECT m.id, m.body, m.created_at, u.id AS sender_id, u.name AS sender_name
       FROM messages m JOIN users u ON u.id = m.sender_id WHERE m.id = ?`
    )
    .get(info.lastInsertRowid);
  res.status(201).json(message);
});

module.exports = router;
