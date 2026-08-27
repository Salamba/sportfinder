const jwt = require('jsonwebtoken');
const { getUserRoles } = require('../utils/roles');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    req.userRoles = getUserRoles(payload.sub);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Неверный или просроченный токен' });
  }
}

// Пропускает дальше, только если у пользователя есть указанная роль
function requireRole(roleName) {
  return (req, res, next) => {
    if (!req.userRoles || !req.userRoles.includes(roleName)) {
      return res.status(403).json({ error: `Требуется роль: ${roleName}` });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole, JWT_SECRET };
