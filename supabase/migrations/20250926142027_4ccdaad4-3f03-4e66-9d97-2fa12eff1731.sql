-- Add password field to managers table
ALTER TABLE public.managers ADD COLUMN password TEXT;

-- Create a function to generate secure passwords
CREATE OR REPLACE FUNCTION public.generate_secure_password()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  password TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    password := password || substr(chars, floor(random() * length(chars))::int + 1, 1);
  END LOOP;
  RETURN password;
END;
$$ LANGUAGE plpgsql;

-- Update existing managers with generated passwords
UPDATE public.managers 
SET password = public.generate_secure_password() 
WHERE password IS NULL;

-- Make password required for new managers
ALTER TABLE public.managers ALTER COLUMN password SET NOT NULL;