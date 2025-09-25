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
                  <h4 className="font-medium mb-2">Edit Your Photo</h4>
                  <div className="border rounded-lg p-2 bg-white min-h-[420px] flex items-center justify-center">
                    <canvas 
                      ref={canvasRef} 
                      className="max-w-full border border-gray-200 rounded" 
                      style={{ display: 'block' }}
                    />
                  </div>
                  {!isEditing && originalFile && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Loading your photo...
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Adjustments</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Brightness</label>
                        <Slider
                          value={[brightness]}
                          onValueChange={(value) => setBrightness(value[0])}
                          min={-50}
                          max={50}
                          step={1}
                          className="mt-1"
                        />
                        <div className="text-xs text-gray-500 mt-1">{brightness > 0 ? '+' : ''}{brightness}</div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Contrast</label>
                        <Slider
                          value={[contrast]}
                          onValueChange={(value) => setContrast(value[0])}
                          min={-50}
                          max={50}
                          step={1}
                          className="mt-1"
                        />
                        <div className="text-xs text-gray-500 mt-1">{contrast > 0 ? '+' : ''}{contrast}</div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Rotation</label>
                        <div className="flex gap-2 mt-1">
                          <Button size="sm" variant="outline" onClick={() => rotateImage(-90)}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => rotateImage(90)}>
                            <RotateCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleConfirm} className="flex-1">
                      <Check className="h-4 w-4 mr-2" />
                      Confirm Photo
                    </Button>
                    <Button variant="outline" onClick={handleRetake}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="text-center">
                <h4 className="font-medium mb-4">Your Badge Preview</h4>
                {badgePreview ? (
                  <div className="inline-block">
                    <canvas ref={previewCanvasRef} className="border rounded-lg shadow-lg max-w-xs" />
                    <div className="mt-4 space-x-2">
                      <Button onClick={handleConfirm} disabled={!!form.getValues('badge_photo_url')}>
                        <Check className="h-4 w-4 mr-2" />
                        {form.getValues('badge_photo_url') ? 'Photo Confirmed' : 'Confirm Photo'}
                      </Button>
                      <Button variant="outline" onClick={handleRetake}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Start Over
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">No preview available</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Perfect Badge Photo Tips</h4>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Face the camera directly with a neutral expression</li>
                      <li>• Use good lighting - avoid shadows on your face</li>
                      <li>• Plain background works best (white or light colored)</li>
                      <li>• Keep your shoulders square to the camera</li>
                      <li>• Remove sunglasses, hats, or face coverings</li>
                      <li>• Make sure the photo is clear and not blurry</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Camera className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Technical Requirements</h4>
                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                      <li>• Minimum resolution: 300x300 pixels</li>
                      <li>• Supported formats: JPG, PNG, WEBP</li>
                      <li>• Maximum file size: 5MB</li>
                      <li>• Your face should fill about 60% of the frame</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};