-- Fix ambiguous column reference in generate_employee_id function
CREATE OR REPLACE FUNCTION public.generate_employee_id()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  next_number INTEGER;
  new_employee_id TEXT;
BEGIN
  -- Get the next number in sequence - qualify column reference to avoid ambiguity
  SELECT COALESCE(MAX(CAST(SUBSTRING(ep.employee_id FROM 4) AS INTEGER)), 0) + 1 
  INTO next_number
  FROM public.employee_profiles ep
  WHERE ep.employee_id ~ '^TRG\d{4}$';
  
  -- Format as TRG + 4-digit number
  new_employee_id := 'TRG' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN new_employee_id;
END;
$function$;