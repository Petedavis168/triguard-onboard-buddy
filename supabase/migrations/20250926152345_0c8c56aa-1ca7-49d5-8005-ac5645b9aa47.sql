-- Create a junction table for manager-team assignments (many-to-many relationship)
CREATE TABLE public.manager_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(manager_id, team_id)
);

-- Enable RLS on the new table
ALTER TABLE public.manager_teams ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Allow admin interface access to manager teams" 
ON public.manager_teams 
FOR ALL 
USING (true);

-- Migrate existing team assignments from managers table to junction table
INSERT INTO public.manager_teams (manager_id, team_id)
SELECT id, team_id 
FROM public.managers 
WHERE team_id IS NOT NULL;

-- Add index for better performance
CREATE INDEX idx_manager_teams_manager_id ON public.manager_teams(manager_id);
CREATE INDEX idx_manager_teams_team_id ON public.manager_teams(team_id);