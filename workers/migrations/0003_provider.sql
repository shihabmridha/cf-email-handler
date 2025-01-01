-- Migration number: 0003 	 2025-01-01T18:59:03.607Z
CREATE TABLE providers
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    userId    INTEGER  NOT NULL,
    domain    TEXT     NOT NULL,
    smtp      TEXT,
    api       TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE TRIGGER IF NOT EXISTS update_providers_updatedAt
    AFTER UPDATE
    ON providers
BEGIN
    UPDATE providers SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
