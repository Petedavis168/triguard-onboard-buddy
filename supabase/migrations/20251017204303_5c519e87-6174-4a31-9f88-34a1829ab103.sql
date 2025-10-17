-- Add assigned_to field to tasks table to track which employee/rep is assigned
ALTER TABLE public.tasks
ADD COLUMN assigned_to uuid REFERENCES public.employee_profiles(id);