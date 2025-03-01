-- Migration number: 0004 	 2025-03-01T19:53:07.234Z
CREATE TABLE email_routes
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    userId    INTEGER  NOT NULL,
    email    TEXT     NOT NULL,
    destination    TEXT     NOT NULL,
    enabled   INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE TRIGGER IF NOT EXISTS update_email_routes_updatedAt
    AFTER UPDATE
    ON email_routes
BEGIN
    UPDATE email_routes SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
