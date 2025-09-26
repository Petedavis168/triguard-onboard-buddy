import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, User, Sparkles, Phone, Clock, Globe } from 'lucide-react';
import { useOnboardingForm } from '@/hooks/useOnboardingForm';

interface BasicInformationStepProps {
  form: UseFormReturn<any>;
  generatedEmail: string;
}

export const BasicInformationStep: React.FC<BasicInformationStepProps> = ({ 
  form, 
  generatedEmail 
}) => {
  const { formatPhoneNumber } = useOnboardingForm();
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-primary/20 bg-gradient-card shadow-soft hover-lift form-field-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Let's start with your basic information. We'll generate your company email automatically!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="form-field-enhanced">
                  <FormLabel className="text-foreground font-medium">First Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your first name" 
                      {...field} 
                      className="border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="form-field-enhanced">
                  <FormLabel className="text-foreground font-medium">Last Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your last name" 
                      {...field} 
                      className="border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem className="form-field-enhanced">
                <FormLabel className="text-foreground font-medium">Nickname (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="What would you prefer to be called?" 
                    {...field} 
                    className="border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cell_phone"
              render={({ field }) => (
                <FormItem className="form-field-enhanced">
                  <FormLabel className="text-foreground font-medium">Cell Phone Number *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(555) 123-4567" 
                      value={field.value}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        field.onChange(formatted);
                      }}
                      className="border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      maxLength={14}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personal_email"
              render={({ field }) => (
                <FormItem className="form-field-enhanced">
                  <FormLabel className="text-foreground font-medium">Personal Email *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="your.personal@email.com" 
                      {...field} 
                      className="border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {generatedEmail && (
            <div className="space-y-4 animate-slide-up">
              <div className="p-6 bg-gradient-success rounded-xl border border-success/20 shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-success-foreground animate-pulse-glow" />
                  <span className="font-semibold text-success-foreground">Your TriGuard Roofing Email Account:</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-5 w-5 text-success-foreground" />
                  <Badge variant="secondary" className="bg-white/90 text-success px-4 py-2 text-base font-medium">
                    {generatedEmail}
                  </Badge>
                </div>
                <div className="bg-white/95 p-4 rounded-lg border border-success/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-success">Temporary Password:</span>
                    <code className="bg-success-light px-3 py-1.5 rounded text-success font-mono text-sm">Roofing2025!</code>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-success" />
                    <span className="font-medium text-success">Access Link:</span>
                    <a href="https://email.triguardroofing.com" target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:text-primary-dark underline-offset-2 hover:underline transition-colors">
                      email.triguardroofing.com
                    </a>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Setup Instructions
                  </h4>
                  <ol className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold min-w-[20px] h-5 flex items-center justify-center bg-blue-200 rounded-full text-xs">1</span>
                      <span>You will receive login instructions at your <strong>personal email</strong> for your company email account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold min-w-[20px] h-5 flex items-center justify-center bg-blue-200 rounded-full text-xs">2</span>
                      <span>Visit <strong>email.triguardroofing.com</strong> and use your provided email and temporary password</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold min-w-[20px] h-5 flex items-center justify-center bg-blue-200 rounded-full text-xs">3</span>
                      <span>You will receive access invitations from multiple platforms:</span>
                    </li>
                  </ol>
                  
                  <div className="mt-3 ml-7 space-y-1 text-sm text-blue-700">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span><strong>Financing/Lenders:</strong> Finturf, Lyon, and Acorn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span><strong>RoofFlow:</strong> Our CRM system</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span><strong>Sales Dispatcher:</strong> Sales management tool</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span><strong>Roofgraf:</strong> Our measurement tool</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span><strong>Opensign:</strong> Our e-signature platform</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span><strong>Projects Portal:</strong> projects.thspros.com (after your first deal)</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-success-foreground/90">
                    <Clock className="h-4 w-4" />
                    <span>Account activation takes 24-48 hours</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 bg-gradient-secondary rounded-xl border border-primary/10 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-primary mb-3">What happens next:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    We'll generate a unique company email address for you
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    Your information will be saved automatically as you progress
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    You can return anytime to continue where you left off
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};