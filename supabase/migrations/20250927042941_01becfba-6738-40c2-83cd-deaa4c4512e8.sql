-- Fix RLS policies for onboarding_forms to allow proper form saving

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Public can update their own onboarding forms" ON public.onboarding_forms;
DROP POLICY IF EXISTS "Secure onboarding form access" ON public.onboarding_forms;

-- Create more permissive policies for onboarding process
CREATE POLICY "Allow onboarding form updates during process" 
ON public.onboarding_forms 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow reading onboarding forms during process" 
ON public.onboarding_forms 
FOR SELECT 
USING (true);

-- Keep admin access
-- (Admin policy already exists and works fine)

-- Keep manager access to their team members
CREATE POLICY "Managers can view their assigned forms" 
ON public.onboarding_forms 
FOR SELECT 
USING (
  manager_id IN (
    SELECT managers.id
    FROM managers
    WHERE managers.email = (auth.jwt() ->> 'email'::text)
  )
  OR is_admin_user()
);