import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, User, Sparkles } from 'lucide-react';

interface BasicInformationStepProps {
  form: UseFormReturn<any>;
  generatedEmail: string;
}

export const BasicInformationStep: React.FC<BasicInformationStepProps> = ({ 
  form, 
  generatedEmail 
}) => {
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

          {generatedEmail && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm mb-2">
                <Sparkles className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-700">Your Generated Email:</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-600" />
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                  {generatedEmail}
                </Badge>
              </div>
              <p className="text-xs text-green-600 mt-2">
                This email address will be created for you and used for all company communications.
              </p>
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