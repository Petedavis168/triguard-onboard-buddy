-- Allow reading manager basic info for task assignments and displays
CREATE POLICY "Public can view manager basic info for tasks"
ON public.managers
FOR SELECT
USING (true);