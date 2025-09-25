import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { US_STATES } from '@/types/onboarding';
import { MapPin, Truck, Home } from 'lucide-react';

interface AddressInformationStepProps {
  form: UseFormReturn<any>;
}

export const AddressInformationStep: React.FC<AddressInformationStepProps> = ({ form }) => {
  const sameAsMailing = form.watch('same_as_mailing');

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Home className="h-5 w-5" />
            Mailing Address
          </CardTitle>
          <p className="text-sm text-blue-600">
            We need your mailing address for important documents and communications.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="street_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Street Address *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123 Main Street" 
                    {...field} 
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">City *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="City" 
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
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">State *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zip_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">ZIP Code *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="12345" 
                      {...field} 
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Truck className="h-5 w-5" />
            Shipping Address
          </CardTitle>
          <p className="text-sm text-green-600">
            Where should we ship your uniform and equipment?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="same_as_mailing"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-green-200 rounded-lg bg-green-50/50">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-green-400 data-[state=checked]:bg-green-600"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-green-700 font-medium">
                    Same as mailing address
                  </FormLabel>
                  <p className="text-xs text-green-600">
                    Check this if your shipping address is the same as your mailing address
                  </p>
                </div>
              </FormItem>
            )}
          />

          {!sameAsMailing && (
            <div className="space-y-4 p-4 border border-orange-200 rounded-lg bg-orange-50">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Different Shipping Address</span>
              </div>
              
              <FormField
                control={form.control}
                name="shipping_street_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Shipping Street Address *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123 Different Street" 
                        {...field} 
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="shipping_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">City *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="City" 
                          {...field} 
                          className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipping_state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">State *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-orange-200 focus:border-orange-400 focus:ring-orange-400">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipping_zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">ZIP Code *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="12345" 
                          {...field} 
                          className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};