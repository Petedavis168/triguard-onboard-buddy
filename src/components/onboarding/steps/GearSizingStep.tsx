import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
const SIZE_OPTIONS = [
  { value: 'xs', label: 'XS' }, { value: 's', label: 'S' }, { value: 'm', label: 'M' },
  { value: 'l', label: 'L' }, { value: 'xl', label: 'XL' }, { value: 'xxl', label: 'XXL' }, { value: 'xxxl', label: 'XXXL' }
];

const SHOE_SIZE_OPTIONS = [
  { value: '6', label: '6' }, { value: '7', label: '7' }, { value: '8', label: '8' }, { value: '9', label: '9' },
  { value: '10', label: '10' }, { value: '11', label: '11' }, { value: '12', label: '12' }, { value: '13', label: '13' }
];
import { Shirt, ShirtIcon, HardHat } from 'lucide-react';

interface GearSizingStepProps {
  form: UseFormReturn<any>;
}

export const GearSizingStep: React.FC<GearSizingStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
              <FormItem>
                <FormLabel>Gender *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <label htmlFor="male" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Male
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <label htmlFor="female" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Shirt className="h-4 w-4" />
                    Shirt Size *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
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
                <FormItem>
                  <FormLabel>Coat Size *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
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
                <FormItem>
                  <FormLabel>Pant Size *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
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
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <HardHat className="h-4 w-4" />
                    Hat Size *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
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
              <FormItem>
                <FormLabel>Shoe Size *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="max-w-xs">
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

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Important</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Please ensure all sizes are accurate. Your uniform and safety equipment will be ordered based on these measurements. 
              If you're unsure about any size, it's better to go slightly larger rather than smaller.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};