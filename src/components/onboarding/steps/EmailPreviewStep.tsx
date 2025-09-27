import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, User, Sparkles, Globe, Clock, Copy, Camera, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailPreviewStepProps {
  form: UseFormReturn<any>;
  generatedEmail: string;
}

export const EmailPreviewStep: React.FC<EmailPreviewStepProps> = ({ 
  form, 
  generatedEmail 
}) => {
  const { toast } = useToast();
  const formData = form.getValues();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
        duration: 2000,
      });
    });
  };

  if (!generatedEmail) {
    return (
      <div className="space-y-6">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium text-amber-700">Generating your company email...</p>
            <p className="text-sm text-amber-600 mt-2">Please wait while we create your credentials</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-card shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-primary text-lg">
            <CheckCircle className="h-5 w-5 text-success" />
            Email Credentials Generated!
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your company email and temporary password have been created. Please save this information or take a screenshot.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info Summary */}
          <div className="p-4 bg-gradient-secondary rounded-xl border border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">Welcome, {formData.first_name} {formData.last_name}!</h3>
                <p className="text-sm text-muted-foreground">Your TriGuard Roofing account is ready</p>
              </div>
            </div>
          </div>

          {/* Email Credentials Card */}
          <div className="p-6 bg-gradient-success rounded-xl border border-success/20 shadow-soft">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-success-foreground" />
              <span className="font-semibold text-success-foreground text-lg">Your Company Credentials</span>
            </div>
            
            <div className="space-y-4">
              {/* Company Email */}
              <div className="bg-white/95 p-4 rounded-lg border border-success/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-success" />
                    <span className="font-medium text-success text-sm">Company Email:</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generatedEmail, 'Email')}
                    className="h-8 w-8 p-0 hover:bg-success/10"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <Badge variant="secondary" className="bg-white/90 text-success px-3 py-2 text-base font-mono">
                  {generatedEmail}
                </Badge>
              </div>

              {/* Temporary Password */}
              <div className="bg-white/95 p-4 rounded-lg border border-success/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-success text-sm">Temporary Password:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard('Roofing2025!', 'Password')}
                    className="h-8 w-8 p-0 hover:bg-success/10"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <code className="bg-success-light px-3 py-2 rounded text-success font-mono text-base font-bold">
                  Roofing2025!
                </code>
              </div>

              {/* Login Portal */}
              <div className="bg-white/95 p-4 rounded-lg border border-success/30">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-success" />
                  <span className="font-medium text-success text-sm">Login Portal:</span>
                </div>
                <a 
                  href="https://email.triguardroofing.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:text-primary-dark underline-offset-2 hover:underline transition-colors font-medium"
                >
                  email.triguardroofing.com
                </a>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                What happens next:
              </h4>
              <ol className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-3">
                  <span className="font-semibold min-w-[24px] h-6 flex items-center justify-center bg-blue-200 rounded-full text-xs">1</span>
                  <span>Login instructions will be sent to your personal email: <strong>{formData.personal_email}</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold min-w-[24px] h-6 flex items-center justify-center bg-blue-200 rounded-full text-xs">2</span>
                  <span>You'll receive platform invitations for: Finturf, Lyon, Acorn, RoofFlow, Sales Dispatcher, Roofgraf, Opensign</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold min-w-[24px] h-6 flex items-center justify-center bg-blue-200 rounded-full text-xs">3</span>
                  <span>Account activation takes <strong>24-48 hours</strong></span>
                </li>
              </ol>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-success-foreground/90">
              <Clock className="h-4 w-4" />
              <span>Save this information now - you'll need it to access your account!</span>
            </div>
          </div>

          {/* Screenshot Reminder */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Camera className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-800">📸 Don't forget to take a screenshot!</h4>
                <p className="text-sm text-purple-600 mt-1">
                  Save your credentials before continuing to the next step
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};