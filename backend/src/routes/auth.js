const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');
const { getUserRoles, grantRoleIfMissing } = require('../utils/roles');

const router = express.Router();

function issueToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '30d' });
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    city: user.city,
    photoUrl: user.photo_url,
    rating: user.rating,
    gamesPlayed: user.games_played,
    roles: getUserRoles(user.id),
  };
}

router.post('/register', (req, res) => {
  const { name, email, password, city } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Заполните имя, email и пароль' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Пользователь с таким email уже есть' });

  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO users (name, email, password_hash, city) VALUES (?, ?, ?, ?)')
    .run(name, email, hash, city || '');
  grantRoleIfMissing(info.lastInsertRowid, 'player'); // базовая роль всем новым пользователям

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ token: issueToken(user.id), user: publicUser(user) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password || '', user.password_hash)) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }
  res.json({ token: issueToken(user.id), user: publicUser(user) });
});

module.exports = router;
