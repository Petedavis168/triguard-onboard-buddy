-- Add policy to allow public manager creation during setup
CREATE POLICY "Allow public manager creation during setup" 
ON public.managers 
FOR INSERT 
WITH CHECK (true);