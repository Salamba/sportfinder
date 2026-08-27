const db = require('../db');

function getUserRoles(userId) {
  return db
    .prepare(
      `SELECT r.name FROM roles r
       JOIN user_roles ur ON ur.role_id = r.id
       WHERE ur.user_id = ?`
    )
    .all(userId)
    .map((r) => r.name);
}

// Выдаёт роль пользователю, если ещё не выдана (например, 'organizer' при создании события/клуба)
function grantRoleIfMissing(userId, roleName) {
  const role = db.prepare('SELECT id FROM roles WHERE name = ?').get(roleName);
  if (!role) return;
  db.prepare('INSERT OR IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)').run(userId, role.id);
}

module.exports = { getUserRoles, grantRoleIfMissing };
