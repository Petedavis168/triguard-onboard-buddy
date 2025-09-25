-- Update RLS policies for managers to allow admin modifications
DROP POLICY IF EXISTS "Allow public read access to managers" ON public.managers;

CREATE POLICY "Allow public read access to managers" 
ON public.managers 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage managers" 
ON public.managers 
FOR ALL 
USING (((auth.jwt() ->> 'email'::text) IN ( SELECT admin_users.email FROM admin_users WHERE admin_users.is_active = true)));

-- Update RLS policies for teams to allow admin modifications  
DROP POLICY IF EXISTS "Allow public read access to teams" ON public.teams;

CREATE POLICY "Allow public read access to teams" 
ON public.teams 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage teams" 
ON public.teams 
FOR ALL 
USING (((auth.jwt() ->> 'email'::text) IN ( SELECT admin_users.email FROM admin_users WHERE admin_users.is_active = true)));