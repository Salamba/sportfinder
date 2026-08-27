// Наполняет базу демо-данными: пользователи, клуб, события, чат.
// Запуск: npm run seed

const bcrypt = require('bcryptjs');
const db = require('./db');

function upsertUser({ name, email, password, city }) {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return existing.id;
  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO users (name, email, password_hash, city) VALUES (?, ?, ?, ?)')
    .run(name, email, hash, city);
  return info.lastInsertRowid;
}

function grantRole(userId, roleName) {
  const role = db.prepare('SELECT id FROM roles WHERE name = ?').get(roleName);
  db.prepare('INSERT OR IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)').run(userId, role.id);
}

const viktor = upsertUser({ name: 'Виктор Смирнов', email: 'viktor@example.com', password: 'password123', city: 'Амстердам' });
grantRole(viktor, 'player');
grantRole(viktor, 'organizer');
grantRole(viktor, 'admin'); // демонстрация платформенной роли Администратора

const daan = upsertUser({ name: 'Даан', email: 'daan@example.com', password: 'password123', city: 'Амстердам' });
grantRole(daan, 'player');
grantRole(daan, 'organizer');

const mila = upsertUser({ name: 'Мила', email: 'mila@example.com', password: 'password123', city: 'Амстердам' });
grantRole(mila, 'player');

// Клуб
let club = db.prepare('SELECT id FROM clubs WHERE name = ?').get('Дюны Волей Клуб');
let clubId;
if (!club) {
  const info = db
    .prepare('INSERT INTO clubs (name, sport_id, organizer_id, city, description) VALUES (?, ?, ?, ?, ?)')
    .run('Дюны Волей Клуб', 4, viktor, 'Амстердам', 'Пляжный волейбол для всех уровней');
  clubId = info.lastInsertRowid;
  db.prepare('INSERT OR IGNORE INTO club_members (club_id, user_id, status) VALUES (?, ?, ?)').run(clubId, viktor, 'member');
} else {
  clubId = club.id;
}

// Событие
let event = db.prepare('SELECT id FROM events WHERE title = ?').get('Вечерний матч на Vondelpark');
if (!event) {
  const info = db
    .prepare(
      `INSERT INTO events (title, sport_id, organizer_id, date_time, location, max_players, level, description)
       VALUES (?, ?, ?, datetime('now', '+3 hours'), ?, ?, ?, ?)`
    )
    .run('Вечерний матч на Vondelpark', 1, daan, 'Vondelpark, поле №2', 10, 'medium', 'Берём мяч, приходите в разных цветах.');
  const eventId = info.lastInsertRowid;
  db.prepare('INSERT INTO event_participants (event_id, user_id, status) VALUES (?, ?, ?)').run(eventId, daan, 'confirmed');
  db.prepare('INSERT INTO event_participants (event_id, user_id, status) VALUES (?, ?, ?)').run(eventId, viktor, 'confirmed');

  const threadInfo = db.prepare('INSERT INTO threads (type, event_id) VALUES (?, ?)').run('event', eventId);
  db.prepare('INSERT INTO messages (thread_id, sender_id, body) VALUES (?, ?, ?)').run(
    threadInfo.lastInsertRowid,
    daan,
    'Всем привет! Поле №2, как обычно 👍'
  );
}

console.log('Демо-данные готовы. Тестовые аккаунты (пароль для всех: password123):');
console.log('  viktor@example.com  — Игрок, Организатор, Администратор');
console.log('  daan@example.com    — Игрок, Организатор (создал событие)');
console.log('  mila@example.com    — Игрок');
