-- Fix managers table - remove overly permissive ALL policy
DROP POLICY IF EXISTS "Admins can manage all managers" ON public.managers;

-- The existing specific policies already cover all operations:
-- "Admin managers can view all managers" - SELECT
-- "Admin managers can update manager data" - UPDATE  
-- "Authenticated admins can create managers" - INSERT
-- "Managers can view their own profile" - SELECT
-- "Managers can update their own activity" - UPDATE

-- Add proper DELETE policy for admins only
CREATE POLICY "Admins can delete managers"
ON public.managers
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users a
    WHERE a.email = current_setting('request.jwt.claims', true)::json->>'email'
    AND a.is_active = true
  )
  OR
  EXISTS (
    SELECT 1 FROM public.managers m
    WHERE m.email = current_setting('request.jwt.claims', true)::json->>'email'
    AND m.is_admin = true
  )
);