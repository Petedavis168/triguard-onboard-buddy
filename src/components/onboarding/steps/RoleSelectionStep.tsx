import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { UseFormReturn } from 'react-hook-form';
import { UserCheck, Info } from 'lucide-react';

interface RoleSelectionStepProps {
  form: UseFormReturn<any>;
}

const EMPLOYEE_ROLES = [
  { value: 'ROOF_PRO', label: 'Roof Pro', description: 'Professional roofer with advanced skills' },
  { value: 'ROOF_HAWK', label: 'Roof Hawk', description: 'Specialized roofing expert' },
  { value: 'CSR', label: 'Customer Service Representative', description: 'Handle customer inquiries and support' },
  { value: 'APPOINTMENT_SETTER', label: 'Appointment Setter', description: 'Schedule customer appointments' },
  { value: 'MANAGER', label: 'Manager', description: 'Team and project management' },
  { value: 'REGIONAL_MANAGER', label: 'Regional Manager', description: 'Regional operations oversight' },
  { value: 'ROOFER', label: 'Roofer', description: 'General roofing technician' },
];

export function RoleSelectionStep({ form }: RoleSelectionStepProps) {
  const selectedRole = form.watch('employee_role');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <UserCheck className="h-6 w-6 text-primary mr-2" />
          <CardTitle>Role Selection</CardTitle>
        </div>
        <CardDescription>
          Select your role within the organization
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-4 md:p-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Your role determines your responsibilities and the training courses you'll be assigned.
          </AlertDescription>
        </Alert>

        {/* Role Selection */}
        <FormField
          control={form.control}
          name="employee_role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Employee Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60">
                  {EMPLOYEE_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value} className="p-3">
                      <div>
                        <div className="font-medium">{role.label}</div>
                        <div className="text-sm text-muted-foreground">{role.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Selected Role Summary */}
        {selectedRole && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Your Selection</h4>
              <div className="space-y-2">
                {selectedRole && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Role:</span>
                    <Badge variant="default">
                      {EMPLOYEE_ROLES.find(r => r.value === selectedRole)?.label}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Based on your role, specific training courses and tasks will be automatically assigned to you during the onboarding process.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}