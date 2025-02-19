-- Migration number: 0003 	 2025-01-01T18:59:03.607Z
CREATE TABLE provider_configs
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT     NOT NULL,
    userId    INTEGER  NOT NULL,
    type      INTEGER NOT NULL CHECK (type IN (1, 2)),
    domain    TEXT     NOT NULL,
    smtp      TEXT,
    api       TEXT,
    enabled   INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE TRIGGER IF NOT EXISTS update_provider_configs_updatedAt
    AFTER UPDATE
    ON provider_configs
BEGIN
    UPDATE provider_configs SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
