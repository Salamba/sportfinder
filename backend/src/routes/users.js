const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { getUserRoles } = require('../utils/roles');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => cb(null, `user-${req.userId}-${Date.now()}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

function fullProfile(userId) {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const sports = db
    .prepare(
      `SELECT s.id, s.name, s.icon FROM sports s
       JOIN user_sports us ON us.sport_id = s.id
       WHERE us.user_id = ?`
    )
    .all(userId);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    city: user.city,
    photoUrl: user.photo_url,
    rating: user.rating,
    gamesPlayed: user.games_played,
    roles: getUserRoles(user.id),
    sports,
  };
}

router.get('/me', requireAuth, (req, res) => {
  res.json(fullProfile(req.userId));
});

router.patch('/me', requireAuth, (req, res) => {
  const { name, city } = req.body;
  db.prepare('UPDATE users SET name = COALESCE(?, name), city = COALESCE(?, city) WHERE id = ?').run(
    name || null,
    city || null,
    req.userId
  );
  res.json(fullProfile(req.userId));
});

// Загрузка/замена фото профиля
router.post('/me/photo', requireAuth, upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не получен' });
  const url = `/uploads/${req.file.filename}`;
  db.prepare('UPDATE users SET photo_url = ? WHERE id = ?').run(url, req.userId);
  res.json({ photoUrl: url });
});

router.put('/me/sports', requireAuth, (req, res) => {
  const { sportIds } = req.body; // массив id видов спорта
  db.prepare('DELETE FROM user_sports WHERE user_id = ?').run(req.userId);
  const stmt = db.prepare('INSERT OR IGNORE INTO user_sports (user_id, sport_id) VALUES (?, ?)');
  (sportIds || []).forEach((id) => stmt.run(req.userId, id));
  res.json(fullProfile(req.userId));
});

module.exports = { router, upload };
