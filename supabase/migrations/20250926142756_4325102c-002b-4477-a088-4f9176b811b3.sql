-- Add force password change flag to managers
ALTER TABLE public.managers ADD COLUMN force_password_change BOOLEAN NOT NULL DEFAULT false;

-- Set force_password_change to true for all existing managers (they should change from default passwords)
UPDATE public.managers SET force_password_change = true;

-- Add username/password fields to onboarding_forms for login
ALTER TABLE public.onboarding_forms 
ADD COLUMN username TEXT,
ADD COLUMN user_password TEXT;

-- Generate usernames and passwords for existing onboarding forms
UPDATE public.onboarding_forms 
SET username = LOWER(CONCAT(first_name, last_name)),
    user_password = COALESCE(cell_phone, '0000000000')
WHERE username IS NULL;