ALTER TABLE tool_feedback ADD COLUMN submission_type TEXT DEFAULT NULL;
ALTER TABLE tool_feedback ADD COLUMN publication_consent_version TEXT DEFAULT NULL;
ALTER TABLE tool_feedback ADD COLUMN publication_consented_at TEXT DEFAULT NULL;
