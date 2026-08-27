const db = require('better-sqlite3')('sportfinder.db');

// Проверим структуру таблицы users
const columns = db.prepare("PRAGMA table_info(users)").all();
console.log('Структура таблицы users:');
console.log(columns.map(col => col.name));

// Посмотрим, есть ли пользователи
const users = db.prepare("SELECT * FROM users").all();
console.log('\nПользователи:');
console.log(users);

db.close();