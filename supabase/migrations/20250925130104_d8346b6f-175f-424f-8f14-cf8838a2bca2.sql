-- Create storage bucket for voice recordings
INSERT INTO storage.buckets (id, name, public) VALUES ('voice-recordings', 'voice-recordings', false);

-- Create RLS policies for voice recordings bucket
CREATE POLICY "Users can upload their own voice recordings" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'voice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own voice recordings" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'voice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all voice recordings" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'voice-recordings' AND ((auth.jwt() ->> 'email'::text) IN ( SELECT admin_users.email FROM admin_users WHERE admin_users.is_active = true)));

-- Add voice recording fields to onboarding_forms table
ALTER TABLE public.onboarding_forms 
ADD COLUMN voice_recording_url text,
ADD COLUMN voice_recording_completed_at timestamp with time zone;

-- Create tasks table for manager task assignments
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  manager_id UUID REFERENCES public.managers(id),
  team_id UUID REFERENCES public.teams(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tasks table
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Allow public read access to tasks" 
ON public.tasks 
FOR SELECT 
USING (true);

CREATE POLICY "Managers can manage their own tasks" 
ON public.tasks 
FOR ALL 
USING (manager_id IN (SELECT id FROM public.managers));

-- Create task assignments table
CREATE TABLE public.task_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id),
  onboarding_form_id UUID REFERENCES public.onboarding_forms(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on task assignments
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for task assignments
CREATE POLICY "Allow public access to task assignments" 
ON public.task_assignments 
FOR ALL 
USING (true);

-- Add trigger for tasks updated_at
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for task_assignments updated_at
CREATE TRIGGER update_task_assignments_updated_at
BEFORE UPDATE ON public.task_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();