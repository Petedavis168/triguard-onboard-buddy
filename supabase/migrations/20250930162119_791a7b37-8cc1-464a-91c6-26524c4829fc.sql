-- Drop the existing conflicting policy
DROP POLICY IF EXISTS "Admins can manage all employee profiles" ON public.employee_profiles;

-- Create separate policies for different operations
-- Allow admins to SELECT all employee profiles
CREATE POLICY "Admins can view all employee profiles"
ON public.employee_profiles
FOR SELECT
USING (
  (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.email = (auth.jwt() ->> 'email'::text)
    AND admin_users.is_active = true
  ))
  OR
  (EXISTS (
    SELECT 1 FROM public.managers
    WHERE managers.email = (auth.jwt() ->> 'email'::text)
    AND managers.is_admin = true
  ))
);

-- Allow admins to UPDATE employee profiles
CREATE POLICY "Admins can update all employee profiles"
ON public.employee_profiles
FOR UPDATE
USING (
  (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.email = (auth.jwt() ->> 'email'::text)
    AND admin_users.is_active = true
  ))
  OR
  (EXISTS (
    SELECT 1 FROM public.managers
    WHERE managers.email = (auth.jwt() ->> 'email'::text)
    AND managers.is_admin = true
  ))
)
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.email = (auth.jwt() ->> 'email'::text)
    AND admin_users.is_active = true
  ))
  OR
  (EXISTS (
    SELECT 1 FROM public.managers
    WHERE managers.email = (auth.jwt() ->> 'email'::text)
    AND managers.is_admin = true
  ))
);

-- Allow admins to DELETE employee profiles
CREATE POLICY "Admins can delete employee profiles"
ON public.employee_profiles
FOR DELETE
USING (
  (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.email = (auth.jwt() ->> 'email'::text)
    AND admin_users.is_active = true
  ))
  OR
  (EXISTS (
    SELECT 1 FROM public.managers
    WHERE managers.email = (auth.jwt() ->> 'email'::text)
    AND managers.is_admin = true
  ))
);