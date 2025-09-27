-- Create roles/positions enum and table
CREATE TYPE public.employee_role AS ENUM (
  'ROOF_PRO',
  'ROOF_HAWK', 
  'CSR',
  'APPOINTMENT_SETTER',
  'MANAGER',
  'REGIONAL_MANAGER',
  'ROOFER'
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create positions table for custom roles
CREATE TABLE public.positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  department_id UUID REFERENCES public.departments(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add department_id to teams table
ALTER TABLE public.teams ADD COLUMN department_id UUID REFERENCES public.departments(id);

-- Add role and position to onboarding_forms
ALTER TABLE public.onboarding_forms ADD COLUMN employee_role public.employee_role;
ALTER TABLE public.onboarding_forms ADD COLUMN position_id UUID REFERENCES public.positions(id);

-- Create course role requirements table
CREATE TABLE public.course_role_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  employee_role public.employee_role,
  position_id UUID REFERENCES public.positions(id),
  is_required BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_role_requirements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for departments
CREATE POLICY "Admins can manage departments" ON public.departments
FOR ALL USING (public.is_admin_user() OR public.is_admin_manager());

CREATE POLICY "Users can view active departments" ON public.departments
FOR SELECT USING (is_active = true);

-- Create RLS policies for positions
CREATE POLICY "Admins can manage positions" ON public.positions
FOR ALL USING (public.is_admin_user() OR public.is_admin_manager());

CREATE POLICY "Users can view active positions" ON public.positions
FOR SELECT USING (is_active = true);

-- Create RLS policies for course role requirements
CREATE POLICY "Admins can manage course role requirements" ON public.course_role_requirements
FOR ALL USING (public.is_admin_user() OR public.is_admin_manager());

CREATE POLICY "Users can view course role requirements" ON public.course_role_requirements
FOR SELECT USING (true);

-- Create indexes
CREATE INDEX idx_departments_is_active ON public.departments(is_active);
CREATE INDEX idx_positions_department_id ON public.positions(department_id);
CREATE INDEX idx_positions_is_active ON public.positions(is_active);
CREATE INDEX idx_teams_department_id ON public.teams(department_id);
CREATE INDEX idx_course_role_requirements_course_id ON public.course_role_requirements(course_id);
CREATE INDEX idx_course_role_requirements_role ON public.course_role_requirements(employee_role);

-- Create triggers for updated_at
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_positions_updated_at
  BEFORE UPDATE ON public.positions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default departments
INSERT INTO public.departments (name, description) VALUES
('Sales', 'Sales and customer acquisition'),
('Operations', 'Field operations and installation'),
('Customer Service', 'Customer support and relations'),
('Management', 'Leadership and administration');

-- Insert default positions for each role
INSERT INTO public.positions (name, description, department_id) 
SELECT 'Roof Pro', 'Professional roofer with advanced skills', d.id FROM public.departments d WHERE d.name = 'Operations'
UNION ALL
SELECT 'Roof Hawk', 'Specialized roofing expert', d.id FROM public.departments d WHERE d.name = 'Operations'
UNION ALL
SELECT 'Customer Service Representative', 'Handle customer inquiries and support', d.id FROM public.departments d WHERE d.name = 'Customer Service'
UNION ALL
SELECT 'Appointment Setter', 'Schedule customer appointments', d.id FROM public.departments d WHERE d.name = 'Sales'
UNION ALL
SELECT 'Manager', 'Team and project management', d.id FROM public.departments d WHERE d.name = 'Management'
UNION ALL  
SELECT 'Regional Manager', 'Regional operations oversight', d.id FROM public.departments d WHERE d.name = 'Management'
UNION ALL
SELECT 'Roofer', 'General roofing technician', d.id FROM public.departments d WHERE d.name = 'Operations';