const db = require('better-sqlite3')('sportfinder.db');

// Посмотрим все таблицы
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Все таблицы:');
console.log(tables.map(t => t.name));

// Проверим таблицу roles
try {
  const roles = db.prepare("SELECT * FROM roles").all();
  console.log('\nРоли:');
  console.log(roles);
} catch (e) {
  console.log('\n❌ Таблица roles не найдена!');
  console.log('Ошибка:', e.message);
}

// Проверим таблицу user_roles
try {
  const userRoles = db.prepare("SELECT * FROM user_roles").all();
  console.log('\nНазначенные роли:');
  console.log(userRoles);
} catch (e) {
  console.log('❌ Таблица user_roles не найдена!');
}

db.close();