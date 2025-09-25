-- Fix RLS policies for onboarding_forms to allow public form creation
-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Allow onboarding form creation" ON public.onboarding_forms;
DROP POLICY IF EXISTS "Allow form updates during onboarding" ON public.onboarding_forms;

-- Create permissive policies that work together
CREATE POLICY "Public can create onboarding forms" 
ON public.onboarding_forms 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Public can update their own onboarding forms" 
ON public.onboarding_forms 
FOR UPDATE 
TO public 
USING (current_step > 0 AND status = 'draft')
WITH CHECK (current_step > 0 AND status = 'draft');

CREATE POLICY "Public can read their own forms during onboarding" 
ON public.onboarding_forms 
FOR SELECT 
TO public 
USING (current_step > 0);