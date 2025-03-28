-- Migration number: 0005 	 2025-03-27T01:11:32.776Z
CREATE TABLE IF NOT EXISTS incoming_history
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fromEmail TEXT NOT NULL,
    toEmail TEXT NOT NULL,
    subject TEXT NOT NULL,
    destination TEXT, -- null if email was dropped
    emailClass TEXT NOT NULL CHECK (emailClass IN ('OTP', 'INVOICE', 'PROMOTIONAL', 'UNKNOWN')),
    summary TEXT,
    createdAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_incoming_history_created_at ON incoming_history(createdAt);
CREATE INDEX IF NOT EXISTS idx_incoming_history_from_email ON incoming_history(fromEmail);
CREATE INDEX IF NOT EXISTS idx_incoming_history_to_email ON incoming_history(destination);
CREATE INDEX IF NOT EXISTS idx_incoming_history_email_class ON incoming_history(emailClass);

CREATE TRIGGER IF NOT EXISTS update_incoming_history_updated_at
    AFTER UPDATE ON incoming_history
BEGIN
    UPDATE incoming_history SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
