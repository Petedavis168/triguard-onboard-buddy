-- Add Pete@triguardroofing.com as admin user
INSERT INTO public.admin_users (
  first_name,
  last_name,
  email,
  password_hash,
  is_active,
  force_password_change
) VALUES (
  'Pete',
  'Admin',
  'Pete@triguardroofing.com',
  public.hash_password('Jaxaroo18!'),
  true,
  false
);