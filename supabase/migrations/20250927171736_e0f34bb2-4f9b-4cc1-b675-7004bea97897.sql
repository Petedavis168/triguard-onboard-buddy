-- Update comment for employee_profiles table to use "rep" terminology
COMMENT ON TABLE public.employee_profiles IS 'Stores rep profile information with auto-generated rep IDs';
COMMENT ON COLUMN public.employee_profiles.employee_id IS 'Auto-generated rep ID in format TRGXXXX';

-- Update function comment to use "rep" terminology  
COMMENT ON FUNCTION public.generate_employee_id() IS 'Generates unique rep IDs in format TRGXXXX (e.g., TRG0001, TRG0002, etc.)';

-- Update trigger comment
COMMENT ON FUNCTION public.set_employee_id() IS 'Trigger function to auto-generate rep IDs for new profiles';