const db = require('better-sqlite3')('sportfinder.db');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Таблицы в БД:');
console.log(tables.map(row => row.name));

// Проверим, есть ли пользователи
try {
  const users = db.prepare("SELECT email, role FROM users").all();
  console.log('\nПользователи:');
  console.log(users);
} catch (e) {
  console.log('\nОшибка: таблица users не найдена или пуста');
}

db.close();