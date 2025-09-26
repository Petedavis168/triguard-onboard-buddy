-- Add RLS policy for managers to view their team members' onboarding forms
CREATE POLICY "Managers can view their team members onboarding forms" 
ON public.onboarding_forms 
FOR SELECT 
USING (
  manager_id IN (
    SELECT id 
    FROM public.managers 
    WHERE email = (auth.jwt() ->> 'email'::text)
  )
);