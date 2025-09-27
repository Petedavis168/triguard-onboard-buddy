-- Add video and recording support to quizzes table
ALTER TABLE public.quizzes 
ADD COLUMN video_url TEXT,
ADD COLUMN intro_video_url TEXT,
ADD COLUMN requires_recording BOOLEAN DEFAULT FALSE,
ADD COLUMN recording_instructions TEXT;

-- Add video and recording support to quiz questions
ALTER TABLE public.quiz_questions
ADD COLUMN video_url TEXT,
ADD COLUMN requires_recording BOOLEAN DEFAULT FALSE,
ADD COLUMN recording_prompt TEXT;

-- Add support for user recordings in quiz responses
ALTER TABLE public.quiz_responses
ADD COLUMN recording_url TEXT;