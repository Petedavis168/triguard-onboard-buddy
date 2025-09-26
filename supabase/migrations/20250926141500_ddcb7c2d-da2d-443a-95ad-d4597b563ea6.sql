-- Create an initial admin user for setup
INSERT INTO public.admin_users (first_name, last_name, email, password_hash, is_active)
VALUES ('Admin', 'User', 'admin@example.com', 'temp_hash', true);

-- Also add a policy to allow public team creation during initial setup
CREATE POLICY "Allow public team creation during setup" 
ON public.teams 
FOR INSERT 
WITH CHECK (true);