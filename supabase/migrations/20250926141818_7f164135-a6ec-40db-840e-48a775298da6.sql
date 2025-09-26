-- Add policy to allow public read access to recruiters during setup
CREATE POLICY "Allow public read access to recruiters during setup" 
ON public.recruiters 
FOR SELECT 
USING (true);