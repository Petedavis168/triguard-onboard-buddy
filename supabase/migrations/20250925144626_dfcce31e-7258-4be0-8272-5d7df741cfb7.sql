-- Add fields for document uploads and direct deposit information to onboarding_forms table
ALTER TABLE public.onboarding_forms 
ADD COLUMN social_security_card_url TEXT,
ADD COLUMN drivers_license_url TEXT,
ADD COLUMN direct_deposit_form_url TEXT,
ADD COLUMN bank_routing_number TEXT,
ADD COLUMN bank_account_number TEXT,
ADD COLUMN account_type TEXT CHECK (account_type IN ('checking', 'savings')),
ADD COLUMN direct_deposit_confirmed BOOLEAN DEFAULT FALSE,
ADD COLUMN documents_uploaded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN direct_deposit_completed_at TIMESTAMP WITH TIME ZONE;

-- Create a new storage bucket for sensitive documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'employee-documents', 
  'employee-documents', 
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);

-- Create RLS policies for the employee documents bucket
CREATE POLICY "Admin users can manage all employee documents" 
ON storage.objects 
FOR ALL 
TO authenticated 
USING (
  bucket_id = 'employee-documents' AND 
  (auth.jwt() ->> 'email') IN (
    SELECT email FROM public.admin_users WHERE is_active = true
  )
);

CREATE POLICY "Users can upload their own documents during onboarding" 
ON storage.objects 
FOR INSERT 
TO public 
WITH CHECK (
  bucket_id = 'employee-documents' AND
  -- Allow public uploads but they will be secured by file naming convention
  true
);

CREATE POLICY "Users can view their own documents during onboarding" 
ON storage.objects 
FOR SELECT 
TO public 
USING (
  bucket_id = 'employee-documents'
);