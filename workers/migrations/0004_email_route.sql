-- Migration number: 0004 	 2025-03-01T19:53:07.234Z
CREATE TABLE email_routes
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    userId      INTEGER  NOT NULL,
    email       TEXT     NOT NULL,
    destination TEXT     NOT NULL,
    type        TEXT     NOT NULL CHECK (type IN ('OTP', 'INVOICE', 'PROMOTIONAL', 'UNKNOWN')),
    enabled     INTEGER  NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
    `drop`      INTEGER  NOT NULL DEFAULT 0 CHECK (`drop` IN (0, 1)),
    received    INTEGER  NOT NULL DEFAULT 0,
    sent        INTEGER  NOT NULL DEFAULT 0,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (userId) REFERENCES users (id),
    UNIQUE(email, type)
);

CREATE INDEX IF NOT EXISTS idx_email_routes_email_type ON email_routes (email, type);

CREATE TRIGGER IF NOT EXISTS update_email_routes_updatedAt
    AFTER UPDATE
    ON email_routes
BEGIN
    UPDATE email_routes SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
