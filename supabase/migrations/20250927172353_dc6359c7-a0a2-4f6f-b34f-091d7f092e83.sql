-- Update RLS policies for employee_profiles to ensure proper access
DROP POLICY IF EXISTS "Admins can manage all employee profiles" ON public.employee_profiles;
DROP POLICY IF EXISTS "Public can view active employee profiles" ON public.employee_profiles;

-- Allow admins and managers to manage all employee profiles
CREATE POLICY "Admins and managers can manage employee profiles" 
ON public.employee_profiles 
FOR ALL 
USING (is_admin_user() OR is_admin_manager());

-- Allow public read access for active profiles (for general visibility)
CREATE POLICY "Public can view active employee profiles" 
ON public.employee_profiles 
FOR SELECT 
USING (is_active = true);

-- Allow inserts during onboarding sync process
CREATE POLICY "Allow profile creation during sync" 
ON public.employee_profiles 
FOR INSERT 
WITH CHECK (true);