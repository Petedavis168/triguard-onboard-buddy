-- Fix remaining policies that reference admin_users directly
-- These could cause similar infinite recursion issues

-- Drop and recreate email_addresses policies
DROP POLICY IF EXISTS "Admins can manage email addresses" ON public.email_addresses;
CREATE POLICY "Admins can manage email addresses" 
ON public.email_addresses 
FOR ALL 
USING (public.is_admin_user());

-- Drop and recreate onboarding_forms policies  
DROP POLICY IF EXISTS "Admins can manage onboarding forms" ON public.onboarding_forms;
CREATE POLICY "Admins can manage onboarding forms" 
ON public.onboarding_forms 
FOR ALL 
USING (public.is_admin_user());

-- Drop and recreate recruiters policies
DROP POLICY IF EXISTS "Admins can manage recruiters" ON public.recruiters;
CREATE POLICY "Admins can manage recruiters" 
ON public.recruiters 
FOR ALL 
USING (public.is_admin_user());

-- Drop and recreate teams policies
DROP POLICY IF EXISTS "Admins can manage teams" ON public.teams;
CREATE POLICY "Admins can manage teams" 
ON public.teams 
FOR ALL 
USING (public.is_admin_user());