-- Add RLS policies for recruiters table to allow admin operations
CREATE POLICY "Admins can manage recruiters" 
ON public.recruiters 
FOR ALL
USING ((auth.jwt() ->> 'email'::text) IN ( 
  SELECT admin_users.email
  FROM admin_users
  WHERE (admin_users.is_active = true)
));