-- Drop the recursive policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can delete admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can insert admin_users" ON public.admin_users;

-- Keep the simple public read policy for authentication
-- (already exists: "Public can view admin users for authentication")

-- Add simple non-recursive policies for write operations
-- These don't check admin_users table recursively, avoiding infinite loops
CREATE POLICY "Allow admin user modifications"
ON public.admin_users
FOR ALL
USING (true)
WITH CHECK (true);