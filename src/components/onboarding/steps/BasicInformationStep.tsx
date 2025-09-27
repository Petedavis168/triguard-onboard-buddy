import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Mail, User, Sparkles, Phone, Clock, Globe, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [showEmailInstructions, setShowEmailInstructions] = useState(false);
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="border-primary/20 bg-gradient-card shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-primary text-lg">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Let's start with your basic information. We'll generate your company email automatically!
          </p>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Mobile-optimized form fields */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">First Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your first name" 
                      {...field} 
                      className="min-h-[44px] text-base border-input focus:border-primary focus:ring-primary/20"
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
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Last Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your last name" 
                      {...field} 
                      className="min-h-[44px] text-base border-input focus:border-primary focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Nickname (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="What would you prefer to be called?" 
                      {...field} 
                      className="min-h-[44px] text-base border-input focus:border-primary focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cell_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Cell Phone Number *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(555) 123-4567" 
                      value={field.value}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        field.onChange(formatted);
                      }}
                      className="min-h-[44px] text-base border-input focus:border-primary focus:ring-primary/20"
                      maxLength={14}
                      inputMode="tel"
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
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Personal Email *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="your.personal@email.com" 
                      {...field} 
                      className="min-h-[44px] text-base border-input focus:border-primary focus:ring-primary/20"
                      inputMode="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {generatedEmail && (
            <div className="space-y-4">
              <div className="p-4 sm:p-6 bg-gradient-success rounded-xl border border-success/20 shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-success-foreground" />
                  <span className="font-semibold text-success-foreground text-sm sm:text-base">Your Company Email:</span>
                </div>
                
                <div className="bg-white/95 p-4 rounded-lg border border-success/30 space-y-3 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <Mail className="h-4 w-4 text-success" />
                    <Badge variant="secondary" className="bg-white/90 text-success px-3 py-1 text-sm font-medium w-fit">
                      {generatedEmail}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="font-medium text-success text-sm">Temp Password:</span>
                    <code className="bg-success-light px-3 py-1.5 rounded text-success font-mono text-sm w-fit">Roofing2025!</code>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <Globe className="h-4 w-4 text-success" />
                    <a href="https://email.triguardroofing.com" target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:text-primary-dark underline-offset-2 hover:underline transition-colors text-sm">
                      email.triguardroofing.com
                    </a>
                  </div>
                </div>
                
                {/* Mobile-optimized collapsible instructions */}
                <Collapsible open={showEmailInstructions} onOpenChange={setShowEmailInstructions}>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between text-success-foreground hover:bg-white/20 p-3"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <Mail className="h-4 w-4" />
                        Email Setup Instructions
                      </span>
                      {showEmailInstructions ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <ol className="space-y-3 text-sm text-blue-800">
                        <li className="flex items-start gap-3">
                          <span className="font-semibold min-w-[24px] h-6 flex items-center justify-center bg-blue-200 rounded-full text-xs">1</span>
                          <span>Login instructions will be sent to your <strong>personal email</strong></span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="font-semibold min-w-[24px] h-6 flex items-center justify-center bg-blue-200 rounded-full text-xs">2</span>
                          <span>Visit <strong>email.triguardroofing.com</strong> with your credentials</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="font-semibold min-w-[24px] h-6 flex items-center justify-center bg-blue-200 rounded-full text-xs">3</span>
                          <span>You'll receive platform invitations for: Finturf, Lyon, Acorn, RoofFlow, Sales Dispatcher, Roofgraf, Opensign</span>
                        </li>
                      </ol>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                
                <div className="mt-4 flex items-center gap-2 text-sm text-success-foreground/90">
                  <Clock className="h-4 w-4" />
                  <span>Account activation: 24-48 hours</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 sm:p-6 bg-gradient-secondary rounded-xl border border-primary/10 shadow-soft">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-full flex-shrink-0">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-primary mb-3 text-sm sm:text-base">What happens next:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>We'll generate a unique company email address for you</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Your information will be saved automatically as you progress</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>You can return anytime to continue where you left off</span>
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