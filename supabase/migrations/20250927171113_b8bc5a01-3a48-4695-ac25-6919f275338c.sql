-- Create employee_profiles table with auto-generated employee IDs
CREATE TABLE public.employee_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL UNIQUE,
  onboarding_form_id UUID REFERENCES public.onboarding_forms(id) ON DELETE CASCADE,
  profile_photo_url TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  department TEXT,
  team TEXT,
  manager_name TEXT,
  hire_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employee_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage all employee profiles" 
ON public.employee_profiles 
FOR ALL 
USING (is_admin_user() OR is_admin_manager());

CREATE POLICY "Public can view active employee profiles" 
ON public.employee_profiles 
FOR SELECT 
USING (is_active = true);

-- Create function to generate employee ID
CREATE OR REPLACE FUNCTION public.generate_employee_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  employee_id TEXT;
BEGIN
  -- Get the next number in sequence
  SELECT COALESCE(MAX(CAST(SUBSTRING(employee_id FROM 4) AS INTEGER)), 0) + 1 
  INTO next_number
  FROM public.employee_profiles
  WHERE employee_id ~ '^TRG\d{4}$';
  
  -- Format as TRG + 4-digit number
  employee_id := 'TRG' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN employee_id;
END;
$$;

-- Create trigger to auto-generate employee ID
CREATE OR REPLACE FUNCTION public.set_employee_id()
RETURNS TRIGGER
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

CREATE TRIGGER trigger_set_employee_id
  BEFORE INSERT ON public.employee_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_employee_id();

-- Create trigger for updated_at
CREATE TRIGGER update_employee_profiles_updated_at
  BEFORE UPDATE ON public.employee_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();