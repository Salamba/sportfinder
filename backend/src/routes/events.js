const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { grantRoleIfMissing } = require('../utils/roles');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => cb(null, `event-${Date.now()}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

function serializeEvent(row, viewerId) {
  const sport = db.prepare('SELECT id, name, icon FROM sports WHERE id = ?').get(row.sport_id);
  const organizer = db.prepare('SELECT id, name, photo_url FROM users WHERE id = ?').get(row.organizer_id);
  const participants = db
    .prepare(
      `SELECT u.id, u.name, u.photo_url, ep.status
       FROM event_participants ep
       JOIN users u ON u.id = ep.user_id
       WHERE ep.event_id = ? AND ep.status = 'confirmed'
       ORDER BY ep.rowid`
    )
    .all(row.id);

  const viewerParticipant = viewerId ? participants.find((p) => p.id === viewerId) : null;

  return {
    id: row.id,
    title: row.title,
    sport,
    organizer,
    club_id: row.club_id,
    dateTime: row.date_time,
    location: row.location,
    maxPlayers: row.max_players,
    level: row.level,
    description: row.description,
    photoUrl: row.photo_url,
    status: row.status,
    filledSlots: participants.length,
    participants,
    isParticipant: !!viewerParticipant,
    isOrganizer: viewerId === row.organizer_id,
  };
}

// Лента событий с фильтрами ?sport=1&level=medium
router.get('/', requireAuth, (req, res) => {
  const { sport, level } = req.query;
  let sql = 'SELECT * FROM events WHERE status != "cancelled"';
  const params = [];
  if (sport) {
    sql += ' AND sport_id = ?';
    params.push(sport);
  }
  if (level) {
    sql += ' AND level = ?';
    params.push(level);
  }
  sql += ' ORDER BY date_time ASC';
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map((r) => serializeEvent(r, req.userId)));
});

router.get('/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Событие не найдено' });
  res.json(serializeEvent(row, req.userId));
});

// Создание события — автоматически выдаёт роль "organizer" и открывает чат события
router.post('/', requireAuth, (req, res) => {
  const { title, sportId, dateTime, location, maxPlayers, level, description } = req.body;
  if (!title || !sportId || !dateTime || !location) {
    return res.status(400).json({ error: 'Заполните название, вид спорта, время и место' });
  }
  const info = db
    .prepare(
      `INSERT INTO events (title, sport_id, organizer_id, date_time, location, max_players, level, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(title, sportId, req.userId, dateTime, location, maxPlayers || 10, level || 'any', description || '');
  const eventId = info.lastInsertRowid;

  db.prepare('INSERT INTO event_participants (event_id, user_id, status) VALUES (?, ?, ?)').run(
    eventId,
    req.userId,
    'confirmed'
  );
  db.prepare('INSERT INTO threads (type, event_id) VALUES (?, ?)').run('event', eventId);
  grantRoleIfMissing(req.userId, 'organizer');

  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
  res.status(201).json(serializeEvent(row, req.userId));
});

router.post('/:id/photo', requireAuth, upload.single('photo'), (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Событие не найдено' });
  if (event.organizer_id !== req.userId) return res.status(403).json({ error: 'Только организатор может менять фото' });
  const url = `/uploads/${req.file.filename}`;
  db.prepare('UPDATE events SET photo_url = ? WHERE id = ?').run(url, req.params.id);
  res.json({ photoUrl: url });
});

// Отклик/присоединение к событию
router.post('/:id/join', requireAuth, (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Событие не найдено' });

  const filled = db
    .prepare('SELECT COUNT(*) AS c FROM event_participants WHERE event_id = ? AND status = "confirmed"')
    .get(req.params.id).c;
  if (filled >= event.max_players) return res.status(409).json({ error: 'Свободных мест нет' });

  db.prepare(
    'INSERT INTO event_participants (event_id, user_id, status) VALUES (?, ?, "confirmed") ON CONFLICT(event_id, user_id) DO UPDATE SET status = "confirmed"'
  ).run(req.params.id, req.userId);

  const newFilled = filled + 1;
  if (newFilled >= event.max_players) {
    db.prepare('UPDATE events SET status = "full" WHERE id = ?').run(req.params.id);
  }
  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  res.json(serializeEvent(row, req.userId));
});

router.post('/:id/leave', requireAuth, (req, res) => {
  db.prepare('DELETE FROM event_participants WHERE event_id = ? AND user_id = ?').run(req.params.id, req.userId);
  db.prepare('UPDATE events SET status = "open" WHERE id = ? AND status = "full"').run(req.params.id);
  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  res.json(serializeEvent(row, req.userId));
});

// Отмена события — только организатор
router.delete('/:id', requireAuth, (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Событие не найдено' });
  if (event.organizer_id !== req.userId) return res.status(403).json({ error: 'Только организатор может отменить событие' });
  db.prepare('UPDATE events SET status = "cancelled" WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
