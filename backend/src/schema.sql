-- SportFinder — схема базы данных (SQLite)

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  city          TEXT DEFAULT '',
  photo_url     TEXT DEFAULT NULL,
  rating        REAL DEFAULT 0,
  games_played  INTEGER DEFAULT 0,
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Платформенные роли: player (Игрок), organizer (Организатор), admin (Администратор)
CREATE TABLE IF NOT EXISTS roles (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS sports (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'football'
);

CREATE TABLE IF NOT EXISTS user_sports (
  user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sport_id INTEGER NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, sport_id)
);

CREATE TABLE IF NOT EXISTS clubs (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT NOT NULL,
  sport_id     INTEGER REFERENCES sports(id),
  organizer_id INTEGER NOT NULL REFERENCES users(id),
  city         TEXT DEFAULT '',
  description  TEXT DEFAULT '',
  photo_url    TEXT DEFAULT NULL,
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS club_members (
  club_id INTEGER NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status  TEXT NOT NULL DEFAULT 'member', -- pending | member
  PRIMARY KEY (club_id, user_id)
);

CREATE TABLE IF NOT EXISTS events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT NOT NULL,
  sport_id     INTEGER REFERENCES sports(id),
  organizer_id INTEGER NOT NULL REFERENCES users(id),
  club_id      INTEGER REFERENCES clubs(id),
  date_time    TEXT NOT NULL,
  location     TEXT NOT NULL,
  max_players  INTEGER NOT NULL DEFAULT 10,
  level        TEXT NOT NULL DEFAULT 'any', -- any | medium | advanced
  description  TEXT DEFAULT '',
  photo_url    TEXT DEFAULT NULL,
  status       TEXT NOT NULL DEFAULT 'open', -- open | full | cancelled | completed
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_participants (
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status   TEXT NOT NULL DEFAULT 'confirmed', -- pending | confirmed | declined
  PRIMARY KEY (event_id, user_id)
);

CREATE TABLE IF NOT EXISTS threads (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  type       TEXT NOT NULL, -- event | club
  event_id   INTEGER REFERENCES events(id) ON DELETE CASCADE,
  club_id    INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  thread_id  INTEGER NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  sender_id  INTEGER NOT NULL REFERENCES users(id),
  body       TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO roles (id, name) VALUES (1, 'player'), (2, 'organizer'), (3, 'admin');

INSERT OR IGNORE INTO sports (id, name, icon) VALUES
  (1, 'Футбол', 'football'),
  (2, 'Баскетбол', 'basketball'),
  (3, 'Теннис', 'tennis'),
  (4, 'Волейбол', 'volleyball'),
  (5, 'Бег', 'running');
