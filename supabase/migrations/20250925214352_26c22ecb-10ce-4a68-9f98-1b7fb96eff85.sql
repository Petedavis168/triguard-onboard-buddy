-- Update the RLS policy for onboarding forms to allow updates during the onboarding process
DROP POLICY IF EXISTS "Public can update their own onboarding forms" ON public.onboarding_forms;

CREATE POLICY "Public can update their own onboarding forms" 
ON public.onboarding_forms 
FOR UPDATE 
USING ((current_step > 0) AND (status IN ('draft', 'in_progress')))
WITH CHECK ((current_step > 0) AND (status IN ('draft', 'in_progress')));