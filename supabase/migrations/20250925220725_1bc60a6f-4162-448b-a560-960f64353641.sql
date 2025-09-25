-- Create missing storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('badge-photos', 'badge-photos', false),
('onboarding-documents', 'onboarding-documents', false),
('direct-deposit-forms', 'direct-deposit-forms', false);

-- Create RLS policies for all buckets
-- Badge photos policies
CREATE POLICY "Users can upload their own badge photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'badge-photos');

CREATE POLICY "Admins can view all badge photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'badge-photos');

-- Onboarding documents policies  
CREATE POLICY "Users can upload onboarding documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'onboarding-documents');

CREATE POLICY "Admins can view onboarding documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'onboarding-documents');

-- Direct deposit forms policies
CREATE POLICY "Users can upload direct deposit forms" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'direct-deposit-forms');

CREATE POLICY "Admins can view direct deposit forms" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'direct-deposit-forms');

-- Voice recordings policies (for existing bucket)
CREATE POLICY "Users can upload voice recordings" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'voice-recordings');

CREATE POLICY "Admins can view voice recordings" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'voice-recordings');

-- Employee documents policies (for existing bucket)
CREATE POLICY "Users can upload employee documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'employee-documents');

CREATE POLICY "Admins can view employee documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'employee-documents');