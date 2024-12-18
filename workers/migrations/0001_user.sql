-- Migration number: 0001 	 2024-12-18T01:11:32.776Z
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    salt TEXT NOT NULL,
    isAdmin INTEGER NOT NULL DEFAULT 0 CHECK (isAdmin IN (0, 1))
);

CREATE INDEX idx_users_email ON users (email);
