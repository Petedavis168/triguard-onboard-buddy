-- Fix critical security vulnerabilities in RLS policies

-- 1. First, drop the overly permissive policy on managers table
DROP POLICY IF EXISTS "Allow admin interface access to managers" ON public.managers;

-- 2. Create a secure admin check function that avoids recursion
CREATE OR REPLACE FUNCTION public.is_authenticated_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  -- Only check admin_users table to avoid recursion with managers table
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (auth.jwt() ->> 'email'::text) 
    AND is_active = true
  );
$$;

-- 3. Create a function to check if user is an admin manager
CREATE OR REPLACE FUNCTION public.is_admin_manager()
RETURNS boolean 
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.managers
    WHERE email = (auth.jwt() ->> 'email'::text)
    AND is_admin = true
  );
$$;

-- 4. Create secure RLS policies for managers table
CREATE POLICY "Admins can manage all managers" 
ON public.managers 
FOR ALL 
USING (public.is_authenticated_admin());

CREATE POLICY "Admin managers can view all managers"
ON public.managers
FOR SELECT
USING (public.is_admin_manager() OR public.is_authenticated_admin());

CREATE POLICY "Admin managers can update manager data"
ON public.managers  
FOR UPDATE
USING (public.is_admin_manager() OR public.is_authenticated_admin())
WITH CHECK (public.is_admin_manager() OR public.is_authenticated_admin());

-- 5. Fix the profiles table recursion issue by updating is_admin_user function
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER  
SET search_path = public
AS $$
  -- Use the new functions to avoid recursion
  SELECT public.is_authenticated_admin() OR public.is_admin_manager();
$$;

-- 6. Ensure managers can still access their own data (keep existing policy)
-- The "Managers can view their own profile" and "Managers can update their own activity" policies remain

-- 7. Remove the overly permissive public creation policy and replace with admin-only
DROP POLICY IF EXISTS "Allow public manager creation during setup" ON public.managers;

-- The "Only admins can create managers" policy already exists and uses is_admin_user() which is now secure