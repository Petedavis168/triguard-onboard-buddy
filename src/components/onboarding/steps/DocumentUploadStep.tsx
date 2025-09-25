import React, { useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DocumentUploadStepProps {
  form: UseFormReturn<any>;
}

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ form }) => {
  const [uploadingSSN, setUploadingSSN] = useState(false);
  const [uploadingDL, setUploadingDL] = useState(false);
  const ssnInputRef = useRef<HTMLInputElement>(null);
  const dlInputRef = useRef<HTMLInputElement>(null);

  const uploadDocument = async (file: File, documentType: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${documentType}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('employee-documents')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('employee-documents')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleSSNUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPG, PNG, WEBP, or PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingSSN(true);
    try {
      const url = await uploadDocument(file, 'ssn-card');
      form.setValue('social_security_card_url', url);
      toast({
        title: "Social Security Card Uploaded",
        description: "Your document has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingSSN(false);
    }
  };

  const handleDLUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPG, PNG, WEBP, or PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingDL(true);
    try {
      const url = await uploadDocument(file, 'drivers-license');
      form.setValue('drivers_license_url', url);
      toast({
        title: "Driver's License Uploaded",
        description: "Your document has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingDL(false);
    }
  };

  const ssnUploaded = form.watch('social_security_card_url');
  const dlUploaded = form.watch('drivers_license_url');

  return (
    <div className="space-y-6">
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <FileText className="h-5 w-5" />
            Required Document Upload
          </CardTitle>
          <p className="text-sm text-amber-600">
            Please upload clear photos or scans of your Social Security card and Driver's License.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Security Card Upload */}
          <div className="border-2 border-dashed border-amber-300 rounded-lg p-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto text-amber-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Social Security Card</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload a clear photo or scan of your Social Security card
              </p>
              
              {ssnUploaded ? (
                <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                  <CheckCircle className="h-5 w-5" />
                  <span>Document uploaded successfully</span>
                </div>
              ) : null}

              <Button 
                onClick={() => ssnInputRef.current?.click()} 
                disabled={uploadingSSN}
                className="gap-2"
                variant={ssnUploaded ? "outline" : "default"}
              >
                <Upload className="h-4 w-4" />
                {uploadingSSN ? 'Uploading...' : ssnUploaded ? 'Replace Document' : 'Upload Social Security Card'}
              </Button>
              
              <input
                ref={ssnInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleSSNUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Driver's License Upload */}
          <div className="border-2 border-dashed border-amber-300 rounded-lg p-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto text-amber-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Driver's License</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload a clear photo or scan of your Driver's License (front and back if needed)
              </p>
              
              {dlUploaded ? (
                <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                  <CheckCircle className="h-5 w-5" />
                  <span>Document uploaded successfully</span>
                </div>
              ) : null}

              <Button 
                onClick={() => dlInputRef.current?.click()} 
                disabled={uploadingDL}
                className="gap-2"
                variant={dlUploaded ? "outline" : "default"}
              >
                <Upload className="h-4 w-4" />
                {uploadingDL ? 'Uploading...' : dlUploaded ? 'Replace Document' : "Upload Driver's License"}
              </Button>
              
              <input
                ref={dlInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleDLUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Important Notice */}
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Important Information</h4>
              <ul className="text-sm text-red-700 mt-2 space-y-1">
                <li>• These documents are required for employment verification</li>
                <li>• Ensure all text is clearly visible and readable</li>
                <li>• Documents must be current and valid</li>
                <li>• Your information will be kept secure and confidential</li>
                <li>• Supported formats: JPG, PNG, WEBP, PDF (max 10MB each)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};