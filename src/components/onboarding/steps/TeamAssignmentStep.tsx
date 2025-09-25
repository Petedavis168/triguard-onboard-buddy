import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Team, Manager, Recruiter } from '@/types/onboarding';
import { Users, UserCheck, Phone } from 'lucide-react';

interface TeamAssignmentStepProps {
  form: UseFormReturn<any>;
}

export const TeamAssignmentStep: React.FC<TeamAssignmentStepProps> = ({ form }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedTeamId = form.watch('team_id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsResult, managersResult, recruitersResult] = await Promise.all([
          supabase.from('teams').select('*'),
          supabase.from('managers').select('*'),
          supabase.from('recruiters').select('*')
        ]);

        if (teamsResult.data) setTeams(teamsResult.data);
        if (managersResult.data) setManagers(managersResult.data);
        if (recruitersResult.data) setRecruiters(recruitersResult.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter managers by selected team
  const filteredManagers = selectedTeamId 
    ? managers.filter(manager => manager.team_id === selectedTeamId)
    : managers;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading team information...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Assignment
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select your team, manager, and recruiter. Your manager will be notified when you complete your onboarding.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Team Selection */}
          <FormField
            control={form.control}
            name="team_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team *</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  // Reset manager selection when team changes
                  form.setValue('manager_id', '');
                }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your team" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        <div>
                          <div className="font-medium">{team.name}</div>
                          {team.description && (
                            <div className="text-xs text-muted-foreground">{team.description}</div>
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

          {/* Manager Selection */}
          <FormField
            control={form.control}
            name="manager_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Manager *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedTeamId ? "Select your manager" : "Please select a team first"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredManagers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        <div>
                          <div className="font-medium">{manager.first_name} {manager.last_name}</div>
                          <div className="text-xs text-muted-foreground">{manager.email}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                {selectedTeamId && filteredManagers.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No managers available for the selected team.
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Recruiter Selection */}
          <FormField
            control={form.control}
            name="recruiter_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Recruiter *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your recruiter" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {recruiters.map((recruiter) => (
                      <SelectItem key={recruiter.id} value={recruiter.id}>
                        <div>
                          <div className="font-medium">{recruiter.first_name} {recruiter.last_name}</div>
                          <div className="text-xs text-muted-foreground">{recruiter.email}</div>
                        </div>
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
              <Badge variant="secondary">What happens next?</Badge>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your manager will receive an email notification when you complete onboarding</li>
              <li>• They will schedule your training and provide your work schedule</li>
              <li>• Your recruiter will be available for any questions during the process</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};