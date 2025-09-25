import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SIZE_OPTIONS, SHOE_SIZE_OPTIONS } from '@/types/onboarding';
import { Shirt, ShirtIcon, HardHat } from 'lucide-react';

interface GearSizingStepProps {
  form: UseFormReturn<any>;
}

export const GearSizingStep: React.FC<GearSizingStepProps> = ({ form }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-primary/20 bg-gradient-card shadow-soft hover-lift form-field-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <ShirtIcon className="h-5 w-5" />
            Personal Information & Gear Sizing
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            We need this information to order your uniform and safety equipment.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gender Selection */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="form-field-enhanced">
                <FormLabel className="text-foreground font-medium">Gender *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-input hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="male" id="male" className="text-primary" />
                      <label htmlFor="male" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                        Male
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-input hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="female" id="female" className="text-primary" />
                      <label htmlFor="female" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                        Female
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Size Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shirt Size */}
            <FormField
              control={form.control}
              name="shirt_size"
              render={({ field }) => (
                <FormItem className="form-field-enhanced">
                  <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                    <Shirt className="h-4 w-4 text-primary" />
                    Shirt Size *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-input focus:border-primary focus:ring-primary/20 transition-all duration-200">
                        <SelectValue placeholder="Select shirt size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Coat Size */}
            <FormField
              control={form.control}
              name="coat_size"
              render={({ field }) => (
                <FormItem className="form-field-enhanced">
                  <FormLabel className="text-foreground font-medium">Coat Size *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-input focus:border-primary focus:ring-primary/20 transition-all duration-200">
                        <SelectValue placeholder="Select coat size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pant Size */}
            <FormField
              control={form.control}
              name="pant_size"
              render={({ field }) => (
                <FormItem className="form-field-enhanced">
                  <FormLabel className="text-foreground font-medium">Pant Size *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-input focus:border-primary focus:ring-primary/20 transition-all duration-200">
                        <SelectValue placeholder="Select pant size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hat Size */}
            <FormField
              control={form.control}
              name="hat_size"
              render={({ field }) => (
                <FormItem className="form-field-enhanced">
                  <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                    <HardHat className="h-4 w-4 text-primary" />
                    Hat Size *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-input focus:border-primary focus:ring-primary/20 transition-all duration-200">
                        <SelectValue placeholder="Select hat size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Shoe Size - Full Width */}
          <FormField
            control={form.control}
            name="shoe_size"
            render={({ field }) => (
              <FormItem className="form-field-enhanced">
                <FormLabel className="text-foreground font-medium">Shoe Size *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="max-w-xs border-input focus:border-primary focus:ring-primary/20 transition-all duration-200">
                      <SelectValue placeholder="Select shoe size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SHOE_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="p-6 bg-gradient-warning rounded-xl border border-warning/20 shadow-soft">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary" className="bg-warning text-warning-foreground font-semibold">Important</Badge>
            </div>
            <p className="text-sm text-foreground">
              Please ensure all sizes are accurate. Your uniform and safety equipment will be ordered based on these measurements. 
              If you're unsure about any size, it's better to go slightly larger rather than smaller.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};