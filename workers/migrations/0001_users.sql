-- Migration number: 0001 	 2024-12-18T01:11:32.776Z
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    salt TEXT NOT NULL,
    isAdmin INTEGER NOT NULL DEFAULT 0 CHECK (isAdmin IN (0, 1)),
    createdAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);

CREATE TRIGGER IF NOT EXISTS update_users_updatedAt
    AFTER UPDATE
    ON users
BEGIN
    UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
