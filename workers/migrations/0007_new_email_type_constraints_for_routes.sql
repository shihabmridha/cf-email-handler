-- Migration number: 0007 	 2025-09-16T22:00:35.485Z
PRAGMA foreign_keys=off;

ALTER TABLE email_routes RENAME TO email_routes_old;

CREATE TABLE email_routes
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    userId      INTEGER  NOT NULL,
    email       TEXT     NOT NULL,
    destination TEXT     NOT NULL,
    type        TEXT     NOT NULL CHECK (type IN ('UNKNOWN', 'OTP', 'INVOICE', 'PROMOTIONAL', 'TRANSACTIONAL')),
    enabled     INTEGER  NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
    `drop`      INTEGER  NOT NULL DEFAULT 0 CHECK (`drop` IN (0, 1)),
    received    INTEGER  NOT NULL DEFAULT 0,
    sent        INTEGER  NOT NULL DEFAULT 0,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (userId) REFERENCES users (id),
    UNIQUE(email, type)
);

-- Copy data from old table into new table
INSERT INTO email_routes
    (id, userId, email, destination, type, enabled, `drop`, received, sent, createdAt, updatedAt)
SELECT
    id, userId, email, destination, type, enabled, `drop`, received, sent, createdAt, updatedAt
FROM email_routes_old;

-- Delete old table
DROP TABLE email_routes_old;

-- Recreate the index
CREATE INDEX IF NOT EXISTS idx_email_routes_email_type ON email_routes (email, type);

-- Recreate the trigger
CREATE TRIGGER IF NOT EXISTS update_email_routes_updatedAt
    AFTER UPDATE
    ON email_routes
BEGIN
    UPDATE email_routes SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
