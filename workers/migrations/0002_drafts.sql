-- Migration number: 0002 	 2024-12-18T13:24:32.143Z
CREATE TABLE IF NOT EXISTS drafts
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    userId     INTEGER  NOT NULL,
    sender     TEXT,
    recipients TEXT,
    cc         TEXT,
    subject    TEXT     NOT NULL,
    body       TEXT,
    createdAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE TRIGGER IF NOT EXISTS update_drafts_updatedAt
    AFTER UPDATE
    ON drafts
BEGIN
    UPDATE drafts SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
