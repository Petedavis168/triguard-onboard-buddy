import React, { useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, RotateCcw, Check } from 'lucide-react';

interface BadgePhotoStepProps {
  form: UseFormReturn<any>;
}

export const BadgePhotoStep: React.FC<BadgePhotoStepProps> = ({ form }) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [badgePreview, setBadgePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setPreviewUrl(imageUrl);
        generateBadgePreview(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateBadgePreview = (imageUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for badge (standard ID card size)
    canvas.width = 300;
    canvas.height = 400;

    // Create badge background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Load and draw the uploaded image
    const img = new Image();
    img.onload = () => {
      // Draw photo in circular crop
      const photoSize = 120;
      const photoX = (canvas.width - photoSize) / 2;
      const photoY = 40;

      ctx.save();
      ctx.beginPath();
      ctx.arc(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
      ctx.restore();

      // Draw company name
      ctx.fillStyle = '#0066cc';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TRIGUARD ROOFING', canvas.width/2, 200);

      // Draw placeholder for name (will be filled with actual name)
      const firstName = form.getValues('first_name') || 'FIRST NAME';
      const lastName = form.getValues('last_name') || 'LAST NAME';
      
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${firstName} ${lastName}`, canvas.width/2, 240);

      // Draw employee ID placeholder
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666666';
      ctx.fillText('Employee ID: XXXXX', canvas.width/2, 270);

      // Add generated email if available
      const generatedEmail = form.getValues('generated_email');
      if (generatedEmail) {
        ctx.font = '12px Arial';
        ctx.fillText(generatedEmail, canvas.width/2, 300);
      }

      // Convert canvas to data URL for preview
      setBadgePreview(canvas.toDataURL('image/png'));
    };
    img.src = imageUrl;
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRetake = () => {
    setPreviewUrl('');
    setBadgePreview('');
    form.setValue('badge_photo_url', '');
  };

  const handleConfirm = () => {
    if (badgePreview) {
      // In a real app, you'd upload to storage here
      // For now, we'll store the data URL
      form.setValue('badge_photo_url', badgePreview);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Badge Photo
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your photo for your employee badge. Make sure it's a clear, front-facing photo.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!previewUrl ? (
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Your Photo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Take a clear, front-facing photo or upload an existing one
              </p>
              <Button onClick={handleUploadClick} className="gap-2">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Photo Preview */}
              <div>
                <h4 className="font-medium mb-2">Original Photo</h4>
                <div className="border rounded-lg p-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-w-xs mx-auto rounded-lg"
                  />
                </div>
              </div>

              {/* Badge Preview */}
              <div>
                <h4 className="font-medium mb-2">Badge Preview</h4>
                <div className="border rounded-lg p-4">
                  {badgePreview && (
                    <img
                      src={badgePreview}
                      alt="Badge Preview"
                      className="w-full max-w-xs mx-auto rounded-lg shadow-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {previewUrl && (
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={handleRetake}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Retake Photo
              </Button>
              <Button
                onClick={handleConfirm}
                className="gap-2"
                disabled={!badgePreview}
              >
                <Check className="h-4 w-4" />
                Confirm Photo
              </Button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <Badge variant="secondary">Photo Guidelines</Badge>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use a clear, recent photo</li>
              <li>• Face should be clearly visible and centered</li>
              <li>• Good lighting with neutral background preferred</li>
              <li>• No hats, sunglasses, or face coverings</li>
              <li>• Professional or business casual appearance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};