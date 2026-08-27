const db = require('better-sqlite3')('sportfinder.db');

// Проверим виды спорта
const sports = db.prepare('SELECT * FROM sports').all();
console.log('Виды спорта:', sports);

// Если видов спорта нет — добавим
if (sports.length === 0) {
  const sportNames = ['Футбол', 'Баскетбол', 'Теннис', 'Волейбол', 'Бег'];
  for (const name of sportNames) {
    db.prepare('INSERT INTO sports (name) VALUES (?)').run(name);
  }
  console.log('✅ Добавлены виды спорта');
}

// Проверим пользователей
const users = db.prepare('SELECT id, name FROM users').all();
console.log('Пользователи:', users);

if (users.length > 0) {
  const organizerId = users[0].id;
  
  // Создаём событие
  const event = db.prepare(`
    INSERT INTO events (title, sport_id, organizer_id, date_time, location, max_players, level, description)
    VALUES (?, ?, ?, datetime('now', '+1 day'), ?, ?, ?, ?)
  `).run(
    'Тестовое событие',
    1, // sport_id
    organizerId,
    'Amsterdam, Vondelpark',
    10,
    'medium',
    'Приходите играть!'
  );
  
  console.log('✅ Создано событие с ID:', event.lastInsertRowid);
}

db.close();