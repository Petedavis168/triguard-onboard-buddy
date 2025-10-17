-- Fix critical security issues
-- 1. Secure admin_users table with proper RLS policies
-- 2. Secure timecards table to prevent employees from viewing each other's data

-- Fix admin_users RLS policies
DROP POLICY IF EXISTS "Allow admin operations on admin_users" ON public.admin_users;

-- Create secure policies for admin_users
-- Only allow admins authenticated through the admin interface to manage admin users
CREATE POLICY "Admins can view admin_users"
ON public.admin_users
FOR SELECT
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

CREATE POLICY "Admins can insert admin_users"
ON public.admin_users
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

CREATE POLICY "Admins can update admin_users"
ON public.admin_users
FOR UPDATE
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

CREATE POLICY "Admins can delete admin_users"
ON public.admin_users
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

-- Fix timecards RLS policies
DROP POLICY IF EXISTS "Authenticated users can manage timecards" ON public.timecards;

-- Create secure policies for timecards
-- Employees can only view and manage their own timecards
CREATE POLICY "Users can view own timecards"
ON public.timecards
FOR SELECT
USING (
  employee_id = auth.uid()
  OR
  -- Allow admins/payroll to view all timecards
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.role IN ('admin', 'executive_team', 'payroll_specialist', 'manager')
  )
);

CREATE POLICY "Users can insert own timecards"
ON public.timecards
FOR INSERT
WITH CHECK (
  employee_id = auth.uid()
  OR
  -- Allow admins/managers to create timecards for others
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.role IN ('admin', 'executive_team', 'payroll_specialist', 'manager')
  )
);

CREATE POLICY "Users can update own timecards"
ON public.timecards
FOR UPDATE
USING (
  employee_id = auth.uid()
  OR
  -- Allow admins/payroll to update any timecards
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.role IN ('admin', 'executive_team', 'payroll_specialist', 'manager')
  )
);

CREATE POLICY "Only admins can delete timecards"
ON public.timecards
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.role IN ('admin', 'executive_team', 'payroll_specialist')
  )
);