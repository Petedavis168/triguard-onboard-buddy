-- Add a trigger to auto-generate employee IDs since it was missing
CREATE OR REPLACE FUNCTION public.set_employee_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.employee_id IS NULL OR NEW.employee_id = '' THEN
    NEW.employee_id := public.generate_employee_id();
  END IF;
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS set_employee_id_trigger ON public.employee_profiles;
CREATE TRIGGER set_employee_id_trigger
  BEFORE INSERT ON public.employee_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_employee_id();