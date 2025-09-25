-- Add new fields to onboarding_forms table
ALTER TABLE public.onboarding_forms 
ADD COLUMN nickname text,
ADD COLUMN cell_phone text,
ADD COLUMN personal_email text;