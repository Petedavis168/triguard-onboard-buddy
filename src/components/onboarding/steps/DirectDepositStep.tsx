import React, { useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DirectDepositStepProps {
  form: UseFormReturn<any>;
}

export const DirectDepositStep: React.FC<DirectDepositStepProps> = ({ form }) => {
  const [uploadingForm, setUploadingForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadDirectDepositForm = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-direct-deposit-form.${fileExt}`;
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

  const handleFormUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingForm(true);
    try {
      const url = await uploadDirectDepositForm(file);
      form.setValue('direct_deposit_form_url', url);
      toast({
        title: "Direct Deposit Form Uploaded",
        description: "Your document has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingForm(false);
    }
  };

  const formatRoutingNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.slice(0, 9);
  };

  const formatAccountNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.slice(0, 17); // Most account numbers are 8-17 digits
  };

  const routingNumber = form.watch('bank_routing_number');
  const accountNumber = form.watch('bank_account_number');
  const accountType = form.watch('account_type');
  const confirmed = form.watch('direct_deposit_confirmed');
  const formUploaded = form.watch('direct_deposit_form_url');

  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CreditCard className="h-5 w-5" />
            Direct Deposit Information
          </CardTitle>
          <p className="text-sm text-green-600">
            Set up your direct deposit to receive your paychecks electronically.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bank Information Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="routing-number">Bank Routing Number</Label>
              <Input
                id="routing-number"
                placeholder="9-digit routing number"
                value={routingNumber || ''}
                onChange={(e) => form.setValue('bank_routing_number', formatRoutingNumber(e.target.value))}
                maxLength={9}
                className="font-mono"
              />
              {routingNumber && routingNumber.length !== 9 && (
                <p className="text-sm text-red-600">Routing number must be exactly 9 digits</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-number">Bank Account Number</Label>
              <Input
                id="account-number"
                placeholder="Account number"
                value={accountNumber || ''}
                onChange={(e) => form.setValue('bank_account_number', formatAccountNumber(e.target.value))}
                maxLength={17}
                className="font-mono"
              />
              {accountNumber && accountNumber.length < 8 && (
                <p className="text-sm text-red-600">Account number must be at least 8 digits</p>
              )}
            </div>
          </div>

          {/* Account Type Selection */}
          <div className="space-y-3">
            <Label>Account Type</Label>
            <RadioGroup
              value={accountType || ''}
              onValueChange={(value) => form.setValue('account_type', value)}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="checking" id="checking" />
                <Label htmlFor="checking">Checking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="savings" id="savings" />
                <Label htmlFor="savings">Savings</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Direct Deposit Form Upload */}
          <div className="border-2 border-dashed border-green-300 rounded-lg p-6">
            <div className="text-center">
              <CreditCard className="h-12 w-12 mx-auto text-green-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Direct Deposit Authorization Form</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload your completed and signed direct deposit form from your bank
              </p>
              
              {formUploaded ? (
                <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                  <CheckCircle className="h-5 w-5" />
                  <span>Form uploaded successfully</span>
                </div>
              ) : null}

              <Button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={uploadingForm}
                className="gap-2"
                variant={formUploaded ? "outline" : "default"}
              >
                <Upload className="h-4 w-4" />
                {uploadingForm ? 'Uploading...' : formUploaded ? 'Replace Form' : 'Upload Direct Deposit Form'}
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFormUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start space-x-3 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <Checkbox
              id="confirm-info"
              checked={confirmed || false}
              onCheckedChange={(checked) => form.setValue('direct_deposit_confirmed', checked)}
            />
            <div className="space-y-1">
              <Label htmlFor="confirm-info" className="text-sm font-medium leading-relaxed cursor-pointer">
                I confirm that all the direct deposit information provided above is correct and true
              </Label>
              <p className="text-xs text-gray-600">
                By checking this box, I understand that I am responsible for providing accurate banking information.
              </p>
            </div>
          </div>

          {/* Important Warning */}
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Important Payment Information</h4>
              <p className="text-sm text-red-700 mt-1">
                <strong>If any of your direct deposit information is incorrect, you will not receive payment until the correct information is provided.</strong> Please double-check all numbers and account details before submitting.
              </p>
              <ul className="text-sm text-red-700 mt-2 space-y-1">
                <li>• Verify your routing number with your bank</li>
                <li>• Confirm your account number matches your bank statement</li>
                <li>• Ensure you've selected the correct account type</li>
                <li>• Contact HR immediately if you need to update this information</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};