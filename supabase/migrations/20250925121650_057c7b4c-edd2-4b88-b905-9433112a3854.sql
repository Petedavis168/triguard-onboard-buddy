-- Create enum types for form data
CREATE TYPE public.gender_type AS ENUM ('male', 'female');
CREATE TYPE public.size_type AS ENUM ('xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl');
CREATE TYPE public.shoe_size_type AS ENUM ('6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5', '14', '14.5', '15');
CREATE TYPE public.form_status_type AS ENUM ('draft', 'in_progress', 'completed', 'submitted');

-- Teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Managers table
CREATE TABLE public.managers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  team_id UUID REFERENCES public.teams(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recruiters table
CREATE TABLE public.recruiters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email addresses table to track generated emails and prevent duplicates
CREATE TABLE public.email_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Main onboarding forms table
CREATE TABLE public.onboarding_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  generated_email TEXT REFERENCES public.email_addresses(email),
  
  -- Address Information
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  
  -- Shipping Address (optional if same as above)
  same_as_mailing BOOLEAN NOT NULL DEFAULT true,
  shipping_street_address TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_zip_code TEXT,
  
  -- Gender and Sizes
  gender gender_type NOT NULL,
  shirt_size size_type NOT NULL,
  coat_size size_type NOT NULL,
  pant_size size_type NOT NULL,
  shoe_size shoe_size_type NOT NULL,
  hat_size size_type NOT NULL,
  
  -- Badge Photo
  badge_photo_url TEXT,
  
  -- Team/Manager/Recruiter
  team_id UUID REFERENCES public.teams(id),
  manager_id UUID REFERENCES public.managers(id),
  recruiter_id UUID REFERENCES public.recruiters(id),
  
  -- W9 Form
  w9_completed BOOLEAN NOT NULL DEFAULT false,
  w9_submitted_at TIMESTAMP WITH TIME ZONE,
  
  -- Form Status and Progress
  status form_status_type NOT NULL DEFAULT 'draft',
  current_step INTEGER NOT NULL DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE
);

-- Admin users table for dashboard authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public access (onboarding forms should be accessible without auth)
CREATE POLICY "Allow public read access to teams" 
ON public.teams FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to managers" 
ON public.managers FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to recruiters" 
ON public.recruiters FOR SELECT 
USING (true);

CREATE POLICY "Allow public access to onboarding forms" 
ON public.onboarding_forms 
FOR ALL 
USING (true);

CREATE POLICY "Allow public read access to email addresses" 
ON public.email_addresses FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to email addresses" 
ON public.email_addresses FOR INSERT 
WITH CHECK (true);

-- Admin users should only be accessible by authenticated admin users
CREATE POLICY "Admin users can access admin users" 
ON public.admin_users 
FOR ALL 
USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users WHERE is_active = true));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_managers_updated_at
BEFORE UPDATE ON public.managers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recruiters_updated_at
BEFORE UPDATE ON public.recruiters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_forms_updated_at
BEFORE UPDATE ON public.onboarding_forms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial data
INSERT INTO public.teams (name, description) VALUES 
('Roofing Team', 'Main roofing installation and repair team'),
('Sales Team', 'Customer acquisition and sales team'),
('Administrative', 'Office and administrative staff');

INSERT INTO public.managers (first_name, last_name, email, team_id) VALUES 
('John', 'Smith', 'john.smith@triguardroofing.com', (SELECT id FROM public.teams WHERE name = 'Roofing Team')),
('Sarah', 'Johnson', 'sarah.johnson@triguardroofing.com', (SELECT id FROM public.teams WHERE name = 'Sales Team')),
('Mike', 'Davis', 'mike.davis@triguardroofing.com', (SELECT id FROM public.teams WHERE name = 'Administrative'));

INSERT INTO public.recruiters (first_name, last_name, email) VALUES 
('Emily', 'Wilson', 'emily.wilson@triguardroofing.com'),
('David', 'Brown', 'david.brown@triguardroofing.com'),
('Lisa', 'Garcia', 'lisa.garcia@triguardroofing.com');