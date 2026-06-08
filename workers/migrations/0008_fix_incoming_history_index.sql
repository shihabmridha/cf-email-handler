-- Migration number: 0008 	 2026-06-08T00:00:01.000Z
DROP INDEX IF EXISTS idx_incoming_history_to_email;
CREATE INDEX IF NOT EXISTS idx_incoming_history_to_email ON incoming_history(toEmail);
