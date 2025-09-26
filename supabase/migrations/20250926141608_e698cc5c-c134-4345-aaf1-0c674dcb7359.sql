-- Add policy to allow public recruiter creation during setup
CREATE POLICY "Allow public recruiter creation during setup" 
ON public.recruiters 
FOR INSERT 
WITH CHECK (true);