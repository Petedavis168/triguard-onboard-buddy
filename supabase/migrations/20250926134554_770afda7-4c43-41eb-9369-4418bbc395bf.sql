-- Fix RLS policy for onboarding_forms to allow all valid statuses
DROP POLICY IF EXISTS "Public can update their own onboarding forms" ON public.onboarding_forms;

CREATE POLICY "Public can update their own onboarding forms" 
ON public.onboarding_forms 
FOR UPDATE 
USING ((current_step > 0) AND (status = ANY (ARRAY['draft'::form_status_type, 'in_progress'::form_status_type, 'completed'::form_status_type, 'submitted'::form_status_type])))
WITH CHECK ((current_step > 0) AND (status = ANY (ARRAY['draft'::form_status_type, 'in_progress'::form_status_type, 'completed'::form_status_type, 'submitted'::form_status_type])));