-- Fix RLS policies for employee_profiles to allow admin sync
DROP POLICY IF EXISTS "Allow profile creation during sync" ON public.employee_profiles;
DROP POLICY IF EXISTS "Admins and managers can manage employee profiles" ON public.employee_profiles;

-- Create new comprehensive policy for admins and managers
CREATE POLICY "Admins and managers can manage employee profiles"
ON public.employee_profiles
FOR ALL
TO authenticated
USING (is_admin_user() OR is_admin_manager())
WITH CHECK (is_admin_user() OR is_admin_manager());

-- Allow public inserts for sync operations (this ensures sync can work)
CREATE POLICY "Allow sync operations"
ON public.employee_profiles
FOR INSERT
TO authenticated
WITH CHECK (true);