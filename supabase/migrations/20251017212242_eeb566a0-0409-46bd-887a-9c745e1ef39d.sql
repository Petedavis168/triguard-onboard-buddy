-- Enable admins to access all private storage buckets for onboarding documents
-- This allows admins to download and view employee documents

-- Policy for admins to view/download from employee-documents bucket
CREATE POLICY "Admins can access employee documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'employee-documents' AND
  (is_admin_user() OR is_admin_manager())
);

-- Policy for admins to view/download from badge-photos bucket
CREATE POLICY "Admins can access badge photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'badge-photos' AND
  (is_admin_user() OR is_admin_manager())
);

-- Policy for admins to view/download from voice-recordings bucket
CREATE POLICY "Admins can access voice recordings"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'voice-recordings' AND
  (is_admin_user() OR is_admin_manager())
);

-- Policy for admins to view/download from direct-deposit-forms bucket
CREATE POLICY "Admins can access direct deposit forms"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'direct-deposit-forms' AND
  (is_admin_user() OR is_admin_manager())
);

-- Policy for admins to view/download from onboarding-documents bucket
CREATE POLICY "Admins can access onboarding documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'onboarding-documents' AND
  (is_admin_user() OR is_admin_manager())
);