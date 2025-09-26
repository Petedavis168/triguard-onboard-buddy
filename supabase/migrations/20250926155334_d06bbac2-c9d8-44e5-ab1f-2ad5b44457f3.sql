-- Add admin role capability to managers
ALTER TABLE public.managers 
ADD COLUMN is_admin boolean NOT NULL DEFAULT false;

-- Drop existing function and recreate with new return type
DROP FUNCTION public.authenticate_admin(text, text);

-- Create updated admin authentication function to include managers with admin privileges
CREATE OR REPLACE FUNCTION public.authenticate_admin(admin_email text, admin_password text)
RETURNS TABLE(id uuid, first_name text, last_name text, email text, force_password_change boolean, last_login_at timestamp with time zone, last_activity_at timestamp with time zone, user_type text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  -- Check admin_users table first
  SELECT a.id, a.first_name, a.last_name, a.email, a.force_password_change, a.last_login_at, a.last_activity_at, 'admin'::text as user_type
  FROM public.admin_users a
  WHERE a.email = admin_email 
    AND public.verify_password(admin_password, a.password_hash)
    AND a.is_active = true
  
  UNION ALL
  
  -- Check managers with admin privileges
  SELECT m.id, m.first_name, m.last_name, m.email, m.force_password_change, m.last_login_at, m.last_activity_at, 'manager_admin'::text as user_type
  FROM public.managers m
  WHERE m.email = admin_email 
    AND public.verify_password(admin_password, m.password_hash)
    AND m.is_admin = true;
$function$;

-- Update is_admin_user function to include managers with admin privileges  
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (auth.jwt() ->> 'email'::text) 
    AND is_active = true
  ) OR EXISTS (
    SELECT 1 FROM public.managers
    WHERE email = (auth.jwt() ->> 'email'::text)
    AND is_admin = true
  );
$function$;