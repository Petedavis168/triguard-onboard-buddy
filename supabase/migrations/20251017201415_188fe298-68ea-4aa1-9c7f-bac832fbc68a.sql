-- Create a function to sync onboarding forms to employee profiles
-- This runs entirely server-side and avoids client-side query timeouts
CREATE OR REPLACE FUNCTION public.sync_onboarding_to_profiles()
RETURNS TABLE (
  profiles_created integer,
  profiles_updated integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profiles_created integer := 0;
  v_profiles_updated integer := 0;
  v_form record;
BEGIN
  -- Loop through onboarding forms that don't have profiles yet
  FOR v_form IN 
    SELECT 
      of.id,
      of.first_name,
      of.last_name,
      of.generated_email,
      of.personal_email,
      of.cell_phone,
      of.employee_role,
      of.badge_photo_url,
      of.status
    FROM public.onboarding_forms of
    WHERE NOT EXISTS (
      SELECT 1 FROM public.employee_profiles ep 
      WHERE ep.onboarding_form_id = of.id
    )
  LOOP
    -- Insert new employee profile
    INSERT INTO public.employee_profiles (
      onboarding_form_id,
      first_name,
      last_name,
      email,
      phone,
      position,
      hire_date,
      profile_photo_url,
      is_active,
      department,
      team,
      manager_name
    ) VALUES (
      v_form.id,
      v_form.first_name,
      v_form.last_name,
      COALESCE(v_form.generated_email, v_form.personal_email),
      v_form.cell_phone,
      v_form.employee_role,
      CURRENT_DATE,
      v_form.badge_photo_url,
      v_form.status IN ('submitted', 'completed'),
      'General',
      'Unassigned',
      'Unassigned'
    );
    
    v_profiles_created := v_profiles_created + 1;
  END LOOP;

  RETURN QUERY SELECT v_profiles_created, v_profiles_updated;
END;
$$;