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
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <p className="text-sm text-blue-600">
            Let's start with your basic information. We'll generate your company email automatically!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">First Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your first name" 
                      {...field} 
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
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
                  <FormLabel className="text-gray-700 font-medium">Last Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your last name" 
                      {...field} 
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
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
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Nickname (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="What would you prefer to be called?" 
                    {...field} 
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
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
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Cell Phone Number *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(555) 123-4567" 
                      value={field.value}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        field.onChange(formatted);
                      }}
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
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
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Personal Email *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="your.personal@email.com" 
                      {...field} 
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {generatedEmail && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-700">Your TriGuard Roofing Email Account:</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                    {generatedEmail}
                  </Badge>
                </div>
                <div className="bg-white/80 p-3 rounded border border-green-200 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-green-700">Temporary Password:</span>
                    <code className="bg-green-100 px-2 py-1 rounded text-green-800 font-mono">Roofing2025!</code>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-700">Access Link:</span>
                    <a href="https://email.triguardroofing.com" target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:text-blue-800 underline">
                      email.triguardroofing.com
                    </a>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <Clock className="h-3 w-3" />
                    <span>Account activation takes 24-48 hours</span>
                  </div>
                  <p className="text-xs text-green-600">
                    <span className="font-medium">Watch for emails from:</span> RoofGraf, FinTurf, Lyon Financial, Acorn, and SalesDispatcher Tool
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-full">
                <User className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-indigo-700 mb-2">What happens next:</p>
                <ul className="space-y-1 text-sm text-indigo-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    We'll generate a unique company email address for you
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    Your information will be saved automatically as you progress
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
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