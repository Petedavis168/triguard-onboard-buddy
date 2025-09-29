import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Send, User, MapPin, Shirt, Camera, Users, FileText, Mail } from 'lucide-react';

interface ReviewSubmitStepProps {
  form: UseFormReturn<any>;
  generatedEmail: string;
  onSubmit: (data: any) => Promise<{ success: boolean }>;
}

export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ 
  form, 
  generatedEmail, 
  onSubmit 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formData = form.getValues();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await onSubmit(formData);
      if (result.success) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    // Redirect to employee login page after 3 seconds
    setTimeout(() => {
      window.location.href = '/user-login';
    }, 3000);

    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Application Submitted Successfully!
          </h2>
          <p className="text-muted-foreground">
            Thank you for completing your onboarding application. 
            You and your manager will receive confirmation emails shortly.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Redirecting you to the employee login page in 3 seconds...
          </p>
        </div>
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <div>
                <strong>What's Next:</strong> Your manager will contact you to schedule training 
                and provide your work schedule. Please check your email regularly for updates.
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Expected Email Invitations
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  You will receive login instructions at your <strong>personal email</strong> for your company email account. 
                  Visit <strong>email.triguardroofing.com</strong> with your provided credentials.
                </p>
                
                <p className="text-sm font-medium text-blue-900 mb-2">Platform Access Invitations:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Finturf, Lyon, Acorn (Financing)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>RoofFlow (CRM)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Sales Dispatcher</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Roofgraf (Measurement Tool)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Opensign (E-signature Platform)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>projects.thspros.com (after first deal)</span>
                  </div>
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
        <div className="pt-4">
          <Button 
            onClick={() => window.location.href = '/user-login'}
            className="gap-2"
          >
            Go to Employee Login Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Review & Submit Application
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Please review all your information before submitting. You can go back to make changes if needed.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <User className="h-4 w-4" />
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{formData.first_name} {formData.last_name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Generated Email:</span>
                <p className="font-medium">{generatedEmail}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address Information */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4" />
              Address Information
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Mailing Address:</span>
                <p className="font-medium">
                  {formData.street_address}, {formData.city}, {formData.state} {formData.zip_code}
                </p>
              </div>
              {!formData.same_as_mailing && (
                <div>
                  <span className="text-muted-foreground">Shipping Address:</span>
                  <p className="font-medium">
                    {formData.shipping_street_address}, {formData.shipping_city}, {formData.shipping_state} {formData.shipping_zip_code}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Gear Sizing */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Shirt className="h-4 w-4" />
              Gear Sizing
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Gender:</span>
                <p className="font-medium capitalize">{formData.gender}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Shirt Size:</span>
                <p className="font-medium uppercase">{formData.shirt_size}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Coat Size:</span>
                <p className="font-medium uppercase">{formData.coat_size}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Pant Size:</span>
                <p className="font-medium uppercase">{formData.pant_size}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Shoe Size:</span>
                <p className="font-medium">{formData.shoe_size}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Hat Size:</span>
                <p className="font-medium uppercase">{formData.hat_size}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Badge Photo */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Camera className="h-4 w-4" />
              Badge Photo
            </h4>
            <div className="flex items-center gap-2">
              {formData.badge_photo_url ? (
                <>
                  <Badge variant="default">✓ Photo Uploaded</Badge>
                  <span className="text-sm text-muted-foreground">Badge photo ready</span>
                </>
              ) : (
                <>
                  <Badge variant="destructive">⚠ No Photo</Badge>
                  <span className="text-sm text-muted-foreground">Please go back and upload a photo</span>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Team Assignment */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Users className="h-4 w-4" />
              Team Assignment
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Team:</span>
                <p className="font-medium">{formData.team_id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Manager:</span>
                <p className="font-medium">{formData.manager_id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Recruiter:</span>
                <p className="font-medium">{formData.recruiter_id}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* W9 Status */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4" />
              W-9 Form Status
            </h4>
            <div className="flex items-center gap-2">
              {formData.w9_completed ? (
                <>
                  <Badge variant="default">✓ Completed</Badge>
                  <span className="text-sm text-muted-foreground">W-9 form completed and saved</span>
                </>
              ) : (
                <>
                  <Badge variant="destructive">⚠ Not Completed</Badge>
                  <span className="text-sm text-muted-foreground">Please complete the W-9 form before submitting</span>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.w9_completed || !formData.badge_photo_url}
              size="lg"
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>

          {(!formData.w9_completed || !formData.badge_photo_url) && (
            <Alert>
              <AlertDescription>
                Please complete all required sections before submitting:
                {!formData.badge_photo_url && " Badge Photo,"}
                {!formData.w9_completed && " W-9 Form"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};