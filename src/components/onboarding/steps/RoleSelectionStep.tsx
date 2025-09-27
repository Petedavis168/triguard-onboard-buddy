import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { UseFormReturn } from 'react-hook-form';
import { UserCheck, Info, Building2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  const [positions, setPositions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedRole = form.watch('employee_role');
  const selectedPositionId = form.watch('position_id');

  const selectedPosition = positions.find(p => p.id === selectedPositionId);
  const selectedDepartment = departments.find(d => d.id === selectedPosition?.department_id);

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const [positionsResponse, departmentsResponse] = await Promise.all([
          supabase
            .from('positions')
            .select(`
              *,
              departments (id, name)
            `)
            .eq('is_active', true)
            .order('name'),
          supabase
            .from('departments')
            .select('*')
            .eq('is_active', true)
            .order('name')
        ]);

        if (positionsResponse.error) throw positionsResponse.error;
        if (departmentsResponse.error) throw departmentsResponse.error;

        setPositions(positionsResponse.data || []);
        setDepartments(departmentsResponse.data || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load role information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoleData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading role information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <UserCheck className="h-6 w-6 text-primary mr-2" />
          <CardTitle>Role & Position Selection</CardTitle>
        </div>
        <CardDescription>
          Select your role and position within the organization
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

        {/* Position Selection */}
        <FormField
          control={form.control}
          name="position_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Specific Position</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60">
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.id} className="p-3">
                      <div>
                        <div className="font-medium">{position.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {position.description}
                        </div>
                        {position.departments && (
                          <div className="flex items-center gap-1 mt-1">
                            <Building2 className="h-3 w-3" />
                            <span className="text-xs text-muted-foreground">
                              {position.departments.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Selected Role/Position Summary */}
        {(selectedRole || selectedPosition) && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Your Selection Summary</h4>
              <div className="space-y-2">
                {selectedRole && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Role:</span>
                    <Badge variant="default">
                      {EMPLOYEE_ROLES.find(r => r.value === selectedRole)?.label}
                    </Badge>
                  </div>
                )}
                {selectedPosition && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Position:</span>
                    <Badge variant="outline">{selectedPosition.name}</Badge>
                  </div>
                )}
                {selectedDepartment && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Department:</span>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span className="text-sm">{selectedDepartment.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Based on your role and position, specific training courses and tasks will be automatically assigned to you during the onboarding process.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}