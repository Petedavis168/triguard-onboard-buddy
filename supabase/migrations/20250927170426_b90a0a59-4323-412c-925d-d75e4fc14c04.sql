-- Create video-files storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('video-files', 'video-files', true);

-- Create storage policies for video files
CREATE POLICY "Video files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'video-files');

CREATE POLICY "Authenticated users can upload video files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'video-files' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their video files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'video-files' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete their video files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'video-files' AND auth.role() = 'authenticated');