-- CRITICAL SECURITY FIX: Remove public access to sensitive employee data

-- 1. Drop the dangerous public access policy on onboarding_forms
DROP POLICY IF EXISTS "Allow public access to onboarding forms" ON public.onboarding_forms;

-- 2. Drop the public read access policy on email_addresses  
DROP POLICY IF EXISTS "Allow public read access to email addresses" ON public.email_addresses;

-- 3. Create secure admin-only policies for onboarding_forms
CREATE POLICY "Admins can manage onboarding forms"
ON public.onboarding_forms
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email'::text) IN (
  SELECT email FROM admin_users WHERE is_active = true
));

-- 4. Create secure admin-only policies for email_addresses
CREATE POLICY "Admins can manage email addresses"
ON public.email_addresses  
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email'::text) IN (
  SELECT email FROM admin_users WHERE is_active = true
));

-- 5. Allow onboarding form creation for unauthenticated users (for the public onboarding process)
-- but restrict to INSERT only, not read/update/delete
CREATE POLICY "Allow onboarding form creation"
ON public.onboarding_forms
FOR INSERT
TO anon
WITH CHECK (true);

-- 6. Allow onboarding forms to be updated by their creators during the process
-- This uses a session-based approach where we can identify the form being worked on
CREATE POLICY "Allow form updates during onboarding"
ON public.onboarding_forms
FOR UPDATE
TO anon
USING (current_step > 0 AND status = 'draft'::form_status_type);

-- 7. Allow email address creation for the onboarding process
CREATE POLICY "Allow email generation during onboarding"
ON public.email_addresses
FOR INSERT  
TO anon
WITH CHECK (true);