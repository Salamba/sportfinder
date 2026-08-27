const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { grantRoleIfMissing } = require('../utils/roles');

const router = express.Router();

function serializeClub(row, viewerId) {
  const sport = db.prepare('SELECT id, name, icon FROM sports WHERE id = ?').get(row.sport_id);
  const organizer = db.prepare('SELECT id, name FROM users WHERE id = ?').get(row.organizer_id);
  const memberCount = db
    .prepare('SELECT COUNT(*) AS c FROM club_members WHERE club_id = ? AND status = "member"')
    .get(row.id).c;
  const isMember = viewerId
    ? !!db.prepare('SELECT 1 FROM club_members WHERE club_id = ? AND user_id = ? AND status = "member"').get(row.id, viewerId)
    : false;

  return {
    id: row.id,
    name: row.name,
    sport,
    organizer,
    city: row.city,
    description: row.description,
    photoUrl: row.photo_url,
    memberCount,
    isMember,
    isOrganizer: viewerId === row.organizer_id,
  };
}

router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM clubs ORDER BY id DESC').all();
  res.json(rows.map((r) => serializeClub(r, req.userId)));
});

router.post('/', requireAuth, (req, res) => {
  const { name, sportId, city, description } = req.body;
  if (!name || !sportId) return res.status(400).json({ error: 'Укажите название и вид спорта' });

  const info = db
    .prepare('INSERT INTO clubs (name, sport_id, organizer_id, city, description) VALUES (?, ?, ?, ?, ?)')
    .run(name, sportId, req.userId, city || '', description || '');
  db.prepare('INSERT INTO club_members (club_id, user_id, status) VALUES (?, ?, "member")').run(info.lastInsertRowid, req.userId);
  db.prepare('INSERT INTO threads (type, club_id) VALUES (?, ?)').run('club', info.lastInsertRowid);
  grantRoleIfMissing(req.userId, 'organizer');

  const row = db.prepare('SELECT * FROM clubs WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(serializeClub(row, req.userId));
});

router.get('/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM clubs WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Клуб не найден' });
  const members = db
    .prepare(
      `SELECT u.id, u.name, u.photo_url FROM club_members cm
       JOIN users u ON u.id = cm.user_id
       WHERE cm.club_id = ? AND cm.status = 'member'`
    )
    .all(req.params.id);
  const events = db.prepare('SELECT * FROM events WHERE club_id = ? ORDER BY date_time ASC').all(req.params.id);
  res.json({ ...serializeClub(row, req.userId), members, events });
});

router.post('/:id/join', requireAuth, (req, res) => {
  db.prepare('INSERT OR IGNORE INTO club_members (club_id, user_id, status) VALUES (?, ?, "member")').run(
    req.params.id,
    req.userId
  );
  const row = db.prepare('SELECT * FROM clubs WHERE id = ?').get(req.params.id);
  res.json(serializeClub(row, req.userId));
});

module.exports = router;
