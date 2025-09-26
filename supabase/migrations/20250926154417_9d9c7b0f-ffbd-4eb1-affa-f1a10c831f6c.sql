-- Add force_password_change field to admin_users table
ALTER TABLE public.admin_users 
ADD COLUMN force_password_change boolean NOT NULL DEFAULT true,
ADD COLUMN last_login_at timestamp with time zone,
ADD COLUMN last_activity_at timestamp with time zone;

-- Create admin authentication function
CREATE OR REPLACE FUNCTION public.authenticate_admin(admin_email text, admin_password text)
RETURNS TABLE(id uuid, first_name text, last_name text, email text, force_password_change boolean, last_login_at timestamp with time zone, last_activity_at timestamp with time zone)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT a.id, a.first_name, a.last_name, a.email, a.force_password_change, a.last_login_at, a.last_activity_at
  FROM public.admin_users a
  WHERE a.email = admin_email 
    AND public.verify_password(admin_password, a.password_hash)
    AND a.is_active = true;
$function$;

-- Create admin password update function
CREATE OR REPLACE FUNCTION public.update_admin_password(admin_id uuid, current_password text, new_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  admin_record RECORD;
BEGIN
  -- Get admin record
  SELECT * INTO admin_record 
  FROM public.admin_users 
  WHERE id = admin_id;
  
  -- Check if admin exists and current password is correct
  IF admin_record.id IS NULL OR NOT public.verify_password(current_password, admin_record.password_hash) THEN
    RETURN FALSE;
  END IF;
  
  -- Update password
  UPDATE public.admin_users 
  SET password_hash = public.hash_password(new_password),
      force_password_change = FALSE,
      updated_at = now()
  WHERE id = admin_id;
  
  RETURN TRUE;
END;
$function$;