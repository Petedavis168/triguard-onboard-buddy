-- Remove all sample data while preserving table structure
DELETE FROM task_assignments;
DELETE FROM onboarding_forms;
DELETE FROM tasks;
DELETE FROM managers;
DELETE FROM recruiters;
DELETE FROM teams;
DELETE FROM email_addresses;

-- Reset sequences if any exist (optional, but good practice)
-- Note: UUID primary keys don't need sequence resets