import React, { useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BadgePhotoStepProps {
  form: UseFormReturn<any>;
}

export const BadgePhotoStep: React.FC<BadgePhotoStepProps> = ({ form }) => {
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      form.setValue('badge_photo_url', result);
      
      toast({
        title: "Photo Uploaded!",
        description: "Your badge photo has been saved successfully.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setUploadedImage('');
    form.setValue('badge_photo_url', '');
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Camera className="h-5 w-5" />
            Professional Badge Photo
          </CardTitle>
          <p className="text-sm text-purple-600">
            Upload your professional headshot for your badge ID.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!uploadedImage ? (
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 mx-auto text-purple-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Your Photo</h3>
              <p className="text-sm text-gray-600 mb-4">
                Take a clear, front-facing photo or upload an existing one
              </p>
              <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                <Upload className="h-4 w-4" />
                Choose Photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Badge Preview */}
              <div className="bg-white p-6 rounded-lg border-2 border-blue-200 shadow-lg max-w-sm mx-auto">
                <div className="text-center space-y-4">
                  {/* Company Logo Area */}
                  <div className="text-blue-600 font-bold text-sm">TRIGUARD ROOFING</div>
                  
                  {/* Photo in round frame */}
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="w-full h-full rounded-full border-4 border-blue-500 overflow-hidden">
                      <img 
                        src={uploadedImage} 
                        alt="Badge Photo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Employee Information */}
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-800">
                      {form.getValues('first_name') || 'FIRST NAME'} {form.getValues('last_name') || 'LAST NAME'}
                    </div>
                    <div className="text-xs text-gray-600">Employee ID: XXXXX</div>
                    {form.getValues('generated_email') && (
                      <div className="text-xs text-gray-500">{form.getValues('generated_email')}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button variant="outline" onClick={handleRetake}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Upload Different Photo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};