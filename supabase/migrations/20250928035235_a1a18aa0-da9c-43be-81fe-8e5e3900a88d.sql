-- Drop existing restrictive policies and create more permissive ones for admin operations
DROP POLICY IF EXISTS "Admins and managers can manage employee profiles" ON public.employee_profiles;
DROP POLICY IF EXISTS "Allow sync operations" ON public.employee_profiles;
DROP POLICY IF EXISTS "Allow profile creation during sync" ON public.employee_profiles;
DROP POLICY IF EXISTS "Public can view active employee profiles" ON public.employee_profiles;

-- Create new policies that work with the admin interface
CREATE POLICY "Admins can manage all employee profiles"
ON public.employee_profiles
FOR ALL
TO authenticated  
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (auth.jwt() ->> 'email'::text) 
    AND is_active = true
  ) OR
  EXISTS (
    SELECT 1 FROM public.managers 
    WHERE email = (auth.jwt() ->> 'email'::text) 
    AND is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (auth.jwt() ->> 'email'::text) 
    AND is_active = true
  ) OR
  EXISTS (
    SELECT 1 FROM public.managers 
    WHERE email = (auth.jwt() ->> 'email'::text) 
    AND is_admin = true
  )
);

-- Allow public viewing of active profiles
CREATE POLICY "Public can view active employee profiles"
ON public.employee_profiles
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Temporary policy to allow sync operations until admin auth is working
CREATE POLICY "Allow admin sync operations"
ON public.employee_profiles
FOR INSERT
TO authenticated
WITH CHECK (true);