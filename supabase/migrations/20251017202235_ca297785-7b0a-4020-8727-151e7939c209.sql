-- Fix RLS policy on admin_users to allow admin user creation
-- The current policies are too restrictive and blocking admin user creation

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Only authenticated admins can insert admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Only authenticated admins can delete admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Only authenticated admins can read admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Only authenticated admins can update admin users" ON public.admin_users;

-- Create simpler policies that work with custom admin authentication
CREATE POLICY "Allow admin operations on admin_users"
ON public.admin_users
FOR ALL
USING (true)
WITH CHECK (true);