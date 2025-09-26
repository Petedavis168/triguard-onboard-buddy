-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admin users can access admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage managers" ON public.managers;

-- Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (auth.jwt() ->> 'email'::text) 
    AND is_active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create new policies using the security definer function
CREATE POLICY "Admin users can access admin users" 
ON public.admin_users 
FOR ALL 
USING (public.is_admin_user());

CREATE POLICY "Admins can manage managers" 
ON public.managers 
FOR ALL 
USING (public.is_admin_user());

-- Keep the existing public read access for managers
-- (This policy already exists and doesn't cause recursion)