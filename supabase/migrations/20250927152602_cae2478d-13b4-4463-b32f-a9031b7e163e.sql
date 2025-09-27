-- Fix critical security vulnerability: Restrict admin_users table access
-- Remove the overly permissive policy that allows public access
DROP POLICY IF EXISTS "Allow admin interface access to admin users" ON public.admin_users;

-- Create secure policies that only allow authenticated admins to access admin data
CREATE POLICY "Only authenticated admins can read admin users" 
ON public.admin_users 
FOR SELECT 
USING (public.is_admin_user());

CREATE POLICY "Only authenticated admins can insert admin users" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (public.is_admin_user());

CREATE POLICY "Only authenticated admins can update admin users" 
ON public.admin_users 
FOR UPDATE 
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

CREATE POLICY "Only authenticated admins can delete admin users" 
ON public.admin_users 
FOR DELETE 
USING (public.is_admin_user());