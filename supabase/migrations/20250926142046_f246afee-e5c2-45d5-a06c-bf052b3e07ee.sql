-- Fix security warning by setting search_path for the password generation function
CREATE OR REPLACE FUNCTION public.generate_secure_password()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  password TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    password := password || substr(chars, floor(random() * length(chars))::int + 1, 1);
  END LOOP;
  RETURN password;
END;
$$;