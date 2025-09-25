import React, { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Upload, RotateCcw, Check, Zap, AlertTriangle, Lightbulb, Move, RotateCw } from 'lucide-react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';
import { toast } from '@/hooks/use-toast';

interface BadgePhotoStepProps {
  form: UseFormReturn<any>;
}

interface PhotoQualityIssue {
  type: 'lighting' | 'blur' | 'angle' | 'background' | 'distance';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
}

export const BadgePhotoStep: React.FC<BadgePhotoStepProps> = ({ form }) => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [qualityIssues, setQualityIssues] = useState<PhotoQualityIssue[]>([]);
  const [badgePreview, setBadgePreview] = useState<string>('');
  const [activeTab, setActiveTab] = useState('upload');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvas) {
      const canvas = new FabricCanvas(canvasRef.current, {
        width: 400,
        height: 400,
        backgroundColor: '#f8f9fa',
      });
      setFabricCanvas(canvas);

      return () => {
        canvas.dispose();
      };
    }
  }, [canvasRef.current]);

  const analyzePhotoQuality = (imageElement: HTMLImageElement): PhotoQualityIssue[] => {
    const issues: PhotoQualityIssue[] = [];
    
    // Create a small canvas to analyze the image
    const analyzeCanvas = document.createElement('canvas');
    const ctx = analyzeCanvas.getContext('2d');
    if (!ctx) return issues;

    analyzeCanvas.width = 100;
    analyzeCanvas.height = 100;
    ctx.drawImage(imageElement, 0, 0, 100, 100);
    
    const imageData = ctx.getImageData(0, 0, 100, 100);
    const data = imageData.data;
    
    // Analyze brightness
    let totalBrightness = 0;
    let darkPixels = 0;
    let brightPixels = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
      
      if (brightness < 50) darkPixels++;
      if (brightness > 200) brightPixels++;
    }
    
    const avgBrightness = totalBrightness / (data.length / 4);
    const totalPixels = data.length / 4;
    
    if (avgBrightness < 80) {
      issues.push({
        type: 'lighting',
        severity: 'high',
        message: 'Image appears too dark',
        suggestion: 'Use the brightness slider to lighten the image or retake in better lighting'
      });
    } else if (avgBrightness > 200) {
      issues.push({
        type: 'lighting',  
        severity: 'medium',
        message: 'Image appears overexposed',
        suggestion: 'Reduce brightness or retake with less harsh lighting'
      });
    }
    
    if (darkPixels > totalPixels * 0.4) {
      issues.push({
        type: 'background',
        severity: 'medium',
        message: 'Dark background detected',
        suggestion: 'Use a plain light background for better badge visibility'
      });
    }

    // Check image dimensions
    if (imageElement.naturalWidth < 200 || imageElement.naturalHeight < 200) {
      issues.push({
        type: 'distance',
        severity: 'high', 
        message: 'Image resolution is too low',
        suggestion: 'Take a higher resolution photo or move closer to the camera'
      });
    }

    return issues;
  };

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

    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        loadImageToCanvas(img);
        const issues = analyzePhotoQuality(img);
        setQualityIssues(issues);
        if (issues.length === 0) {
          toast({
            title: "Great Photo!",
            description: "Your photo looks good for a badge.",
          });
        }
        setActiveTab('edit');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const loadImageToCanvas = (imageElement: HTMLImageElement) => {
    if (!fabricCanvas) return;

    // Clear existing objects
    fabricCanvas.clear();
    
    // Calculate dimensions to fit image in canvas while maintaining aspect ratio
    const canvasWidth = 400;
    const canvasHeight = 400;
    const imgAspect = imageElement.naturalWidth / imageElement.naturalHeight;
    
    let width, height;
    if (imgAspect > 1) {
      width = Math.min(canvasWidth, imageElement.naturalWidth);
      height = width / imgAspect;
    } else {
      height = Math.min(canvasHeight, imageElement.naturalHeight);
      width = height * imgAspect;
    }

    FabricImage.fromURL(imageElement.src, {
      crossOrigin: 'anonymous'
    }).then((fabricImg) => {
      fabricImg.set({
        left: (canvasWidth - width) / 2,
        top: (canvasHeight - height) / 2,
        scaleX: width / fabricImg.width!,
        scaleY: height / fabricImg.height!,
        selectable: true,
        hasControls: true,
        hasBorders: true,
      });
      
      fabricCanvas.add(fabricImg);
      fabricCanvas.setActiveObject(fabricImg);
      fabricCanvas.renderAll();
      setIsEditing(true);
      generateBadgePreview();
    });
  };

  const applyFilters = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject instanceof FabricImage) {
      // Apply brightness and contrast using CSS filters
      const filters = [];
      
      if (brightness !== 0) {
        filters.push(`brightness(${1 + brightness / 100})`);
      }
      
      if (contrast !== 0) {
        filters.push(`contrast(${1 + contrast / 100})`);
      }
      
      // Apply CSS filters
      const filterString = filters.length > 0 ? filters.join(' ') : 'none';
      (activeObject as any).set('filters', filterString);
      fabricCanvas.renderAll();
      generateBadgePreview();
    }
  };

  const rotateImage = (degrees: number) => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      const currentAngle = activeObject.angle || 0;
      activeObject.rotate(currentAngle + degrees);
      fabricCanvas.renderAll();
      generateBadgePreview();
    }
  };

  const generateBadgePreview = () => {
    if (!fabricCanvas) return;

    // Create preview canvas
    const previewCanvas = previewCanvasRef.current;
    if (!previewCanvas) return;

    const ctx = previewCanvas.getContext('2d');
    if (!ctx) return;

    previewCanvas.width = 300;
    previewCanvas.height = 400;

    // Draw badge background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

    // Draw border
    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, previewCanvas.width, previewCanvas.height);

    // Get current canvas as image
    const canvasDataUrl = fabricCanvas.toDataURL();
    const canvasImg = new Image();
    
    canvasImg.onload = () => {
      // Draw photo in circular crop
      const photoSize = 120;
      const photoX = (previewCanvas.width - photoSize) / 2;
      const photoY = 40;

      ctx.save();
      ctx.beginPath();
      ctx.arc(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      ctx.drawImage(canvasImg, photoX, photoY, photoSize, photoSize);
      ctx.restore();

      // Draw company name
      ctx.fillStyle = '#0066cc';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TRIGUARD ROOFING', previewCanvas.width/2, 200);

      // Draw employee name
      const firstName = form.getValues('first_name') || 'FIRST NAME';
      const lastName = form.getValues('last_name') || 'LAST NAME';
      
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${firstName} ${lastName}`, previewCanvas.width/2, 240);

      // Draw employee ID
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666666';
      ctx.fillText('Employee ID: XXXXX', previewCanvas.width/2, 270);

      // Add generated email if available
      const generatedEmail = form.getValues('generated_email');
      if (generatedEmail) {
        ctx.font = '12px Arial';
        ctx.fillText(generatedEmail, previewCanvas.width/2, 300);
      }

      setBadgePreview(previewCanvas.toDataURL('image/png'));
    };
    
    canvasImg.src = canvasDataUrl;
  };

  const handleConfirm = async () => {
    if (!fabricCanvas) {
      toast({
        title: "No Photo",
        description: "Please upload and edit a photo first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Export the edited image
      const editedImageDataUrl = fabricCanvas.toDataURL();

      // Save to form
      form.setValue('badge_photo_url', editedImageDataUrl);
      
      toast({
        title: "Photo Confirmed!",
        description: "Your badge photo has been saved successfully.",
      });
      
      setActiveTab('preview');
    } catch (error) {
      console.error('Error confirming photo:', error);
      toast({
        title: "Error",
        description: "Failed to save photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRetake = () => {
    if (fabricCanvas) {
      fabricCanvas.clear();
    }
    setOriginalFile(null);
    setBadgePreview('');
    setIsEditing(false);
    setBrightness(0);
    setContrast(0);
    setRotation(0);
    setQualityIssues([]);
    setActiveTab('upload');
    form.setValue('badge_photo_url', '');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 border-red-200 bg-red-50';
      case 'medium': return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'low': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  useEffect(() => {
    applyFilters();
  }, [brightness, contrast]);

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Camera className="h-5 w-5" />
            Professional Badge Photo
          </CardTitle>
          <p className="text-sm text-purple-600">
            Upload your photo and use our editing tools to create the perfect badge photo.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="edit" disabled={!originalFile}>Edit</TabsTrigger>
              <TabsTrigger value="preview" disabled={!badgePreview}>Preview</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              {!originalFile ? (
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
                <div className="text-center space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-700 font-medium">Photo uploaded successfully!</p>
                    <p className="text-sm text-green-600">Click the Edit tab to customize your photo.</p>
                  </div>
                  <Button variant="outline" onClick={handleRetake}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Upload Different Photo
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="edit" className="space-y-4">
              {qualityIssues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Photo Analysis & Suggestions
                  </h4>
                  {qualityIssues.map((issue, index) => (
                    <Alert key={index} className={getSeverityColor(issue.severity)}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>{issue.message}</strong>
                        <br />
                        <span className="text-xs">{issue.suggestion}</span>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Edit Your Photo</h4>
                  <div className="border rounded-lg p-2 bg-white">
                    <canvas ref={canvasRef} className="max-w-full" />
                  </div>
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