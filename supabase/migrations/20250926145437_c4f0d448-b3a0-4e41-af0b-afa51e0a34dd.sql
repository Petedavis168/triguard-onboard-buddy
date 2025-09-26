-- Fix manager password security vulnerability using built-in md5 function
-- Step 1: Add password_hash column
ALTER TABLE public.managers ADD COLUMN password_hash TEXT;

-- Step 2: Create password hashing function using built-in md5 with salt
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT md5(password || 'triguard_security_salt_2025');
$$;

-- Step 3: Create a function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_password(password TEXT, password_hash TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT password_hash = md5(password || 'triguard_security_salt_2025');
$$;

-- Step 4: Hash all existing passwords and store in password_hash column
UPDATE public.managers 
SET password_hash = public.hash_password(password)
WHERE password_hash IS NULL;

-- Step 5: Make password_hash NOT NULL after migration
ALTER TABLE public.managers ALTER COLUMN password_hash SET NOT NULL;

-- Step 6: Remove the insecure plaintext password column
ALTER TABLE public.managers DROP COLUMN password;

-- Step 7: Remove the dangerous public read access policy
DROP POLICY IF EXISTS "Allow public read access to managers" ON public.managers;

-- Step 8: Create secure RLS policies for managers
-- Only admins can manage all manager data
CREATE POLICY "Admins can manage all managers"
ON public.managers
FOR ALL
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- Managers can only view their own basic info (needed for dashboard)
CREATE POLICY "Managers can view their own profile"
ON public.managers
FOR SELECT
USING (auth.jwt() ->> 'email' = email);

-- Only admins can create new managers
CREATE POLICY "Only admins can create managers"
ON public.managers  
FOR INSERT
WITH CHECK (is_admin_user());

-- Managers can update their own activity timestamps
CREATE POLICY "Managers can update their own activity"
ON public.managers
FOR UPDATE
USING (auth.jwt() ->> 'email' = email)
WITH CHECK (auth.jwt() ->> 'email' = email);

-- Step 9: Create a secure function for manager authentication
CREATE OR REPLACE FUNCTION public.authenticate_manager(manager_email TEXT, manager_password TEXT)
RETURNS TABLE(
  id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  team_id UUID,
  force_password_change BOOLEAN,
  last_login_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.id, m.first_name, m.last_name, m.email, m.team_id, m.force_password_change, m.last_login_at, m.last_activity_at
  FROM public.managers m
  WHERE m.email = manager_email 
    AND public.verify_password(manager_password, m.password_hash);
$$;

-- Step 10: Create a function to update manager password securely
CREATE OR REPLACE FUNCTION public.update_manager_password(manager_id UUID, current_password TEXT, new_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  manager_record RECORD;
BEGIN
  -- Get manager record
  SELECT * INTO manager_record 
  FROM public.managers 
  WHERE id = manager_id;
  
  -- Check if manager exists and current password is correct
  IF manager_record.id IS NULL OR NOT public.verify_password(current_password, manager_record.password_hash) THEN
    RETURN FALSE;
  END IF;
  
  -- Update password
  UPDATE public.managers 
  SET password_hash = public.hash_password(new_password),
      force_password_change = FALSE,
      updated_at = now()
  WHERE id = manager_id;
  
  RETURN TRUE;
END;
$$;