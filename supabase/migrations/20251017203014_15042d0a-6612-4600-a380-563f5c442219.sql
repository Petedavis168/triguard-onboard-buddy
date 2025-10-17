-- Fix managers table security - restrict public access
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow admin interface to create managers" ON public.managers;

-- Ensure only authenticated admins can create managers
CREATE POLICY "Authenticated admins can create managers"
ON public.managers
FOR INSERT
WITH CHECK (
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