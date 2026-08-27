const db = require('better-sqlite3')('sportfinder.db');

try {
  // Проверяем, есть ли колонка cancelled
  const columns = db.prepare("PRAGMA table_info(events)").all();
  const hasCancelled = columns.some(col => col.name === 'cancelled');
  
  if (!hasCancelled) {
    console.log('⚠️ Колонка "cancelled" отсутствует. Добавляем...');
    db.prepare("ALTER TABLE events ADD COLUMN cancelled INTEGER DEFAULT 0").run();
    console.log('✅ Колонка "cancelled" добавлена!');
  } else {
    console.log('✅ Колонка "cancelled" уже существует.');
  }
  
  // Проверим, есть ли колонка created_at (может тоже понадобиться)
  const hasCreatedAt = columns.some(col => col.name === 'created_at');
  if (!hasCreatedAt) {
    console.log('⚠️ Колонка "created_at" отсутствует. Добавляем...');
    db.prepare("ALTER TABLE events ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP").run();
    console.log('✅ Колонка "created_at" добавлена!');
  }
  
  console.log('\n✅ База данных обновлена!');
} catch (e) {
  console.error('❌ Ошибка:', e.message);
}

db.close();