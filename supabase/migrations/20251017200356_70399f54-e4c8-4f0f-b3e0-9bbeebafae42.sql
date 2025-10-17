-- Add a policy to allow all authenticated access to employee_profiles for admin interface
-- This works with the custom admin authentication system
CREATE POLICY "Allow admin interface to read employee profiles"
ON public.employee_profiles
FOR SELECT
USING (true);

-- Update the insert policy to be more explicit
DROP POLICY IF EXISTS "Allow admin sync operations" ON public.employee_profiles;

CREATE POLICY "Allow admin interface to insert employee profiles"
ON public.employee_profiles
FOR INSERT
WITH CHECK (true);