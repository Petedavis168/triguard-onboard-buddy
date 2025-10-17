-- Allow public read access to admin_users since authentication is handled via RPC
-- The authenticate_admin RPC function validates credentials
CREATE POLICY "Public can view admin users for authentication"
ON public.admin_users
FOR SELECT
USING (true);