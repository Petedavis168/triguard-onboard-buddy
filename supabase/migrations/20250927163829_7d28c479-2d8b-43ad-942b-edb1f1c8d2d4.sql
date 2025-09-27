-- Add video and intro fields to courses table
ALTER TABLE public.courses 
ADD COLUMN video_url TEXT,
ADD COLUMN intro_text TEXT;