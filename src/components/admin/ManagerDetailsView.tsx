import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Save, 
  Users, 
  Mail, 
  Building, 
  Clock, 
  Activity, 
  Shield,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const managerEditSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  team_ids: z.array(z.string()).optional(),
});

type ManagerEditFormData = z.infer<typeof managerEditSchema>;

interface Manager {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  team_id: string | null;
  password_hash: string;
  force_password_change: boolean;
  last_login_at: string | null;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
  assigned_teams?: Team[];
}

interface Team {
  id: string;
  name: string;
  description: string | null;
}

interface ManagerDetailsViewProps {
  manager: Manager;
  teams: Team[];
  onBack: () => void;
  onUpdate: () => void;
  generatedPasswords: Map<string, string>;
  visiblePasswords: Set<string>;
  onTogglePasswordVisibility: (managerId: string) => void;
  onRegeneratePassword: (manager: Manager) => void;
}

export const ManagerDetailsView: React.FC<ManagerDetailsViewProps> = ({
  manager,
  teams,
  onBack,
  onUpdate,
  generatedPasswords,
  visiblePasswords,
  onTogglePasswordVisibility,
  onRegeneratePassword
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [assignedTeams, setAssignedTeams] = useState<string[]>([]);

  const form = useForm<ManagerEditFormData>({
    resolver: zodResolver(managerEditSchema),
    defaultValues: {
      first_name: manager.first_name,
      last_name: manager.last_name,
      email: manager.email,
      team_ids: [],
    },
  });

  useEffect(() => {
    fetchAssignedTeams();
  }, [manager.id]);

  const fetchAssignedTeams = async () => {
    try {
      const { data: teamAssignments } = await supabase
        .from('manager_teams')
        .select('team_id')
        .eq('manager_id', manager.id);
      
      const teamIds = teamAssignments?.map(ta => ta.team_id) || [];
      setAssignedTeams(teamIds);
      form.setValue('team_ids', teamIds);
    } catch (error) {
      console.error('Error fetching assigned teams:', error);
    }
  };

  const handleSave = async (data: ManagerEditFormData) => {
    try {
      // Update manager basic info
      const { error: managerError } = await supabase
        .from('managers')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', manager.id);

      if (managerError) throw managerError;

      // Update team assignments
      // First, remove existing assignments
      await supabase
        .from('manager_teams')
        .delete()
        .eq('manager_id', manager.id);

      // Then add new assignments
      if (data.team_ids && data.team_ids.length > 0) {
        const teamAssignments = data.team_ids.map(teamId => ({
          manager_id: manager.id,
          team_id: teamId
        }));

        await supabase
          .from('manager_teams')
          .insert(teamAssignments);
      }

      toast({
        title: "Success",
        description: "Manager updated successfully"
      });

      setIsEditing(false);
      onUpdate();
      fetchAssignedTeams();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update manager",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return formatDate(dateString);
  };

  const getAssignedTeamNames = () => {
    if (assignedTeams.length === 0) return 'No teams assigned';
    return assignedTeams
      .map(teamId => teams.find(t => t.id === teamId)?.name || 'Unknown Team')
      .join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Managers
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {manager.first_name} {manager.last_name}
            </h2>
            <p className="text-muted-foreground">Manager Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                form.reset({
                  first_name: manager.first_name,
                  last_name: manager.last_name,
                  email: manager.email,
                  team_ids: assignedTeams,
                });
              }}>
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(handleSave)}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Manager
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      {...form.register('first_name')}
                    />
                    {form.formState.errors.first_name && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      {...form.register('last_name')}
                    />
                    {form.formState.errors.last_name && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Name:</span>
                  <span>{manager.first_name} {manager.last_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Email:</span>
                  <span>{manager.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Created:</span>
                  <span>{formatDate(manager.created_at)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-3 w-3 text-green-600" />
                <span className="text-gray-600">Last login:</span>
                <span className="font-medium">{formatRelativeTime(manager.last_login_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-3 w-3 text-blue-600" />
                <span className="text-gray-600">Activity:</span>
                <span className="font-medium">{formatRelativeTime(manager.last_activity_at)}</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Password Status</span>
              </div>
              
              {generatedPasswords.has(manager.id) ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTogglePasswordVisibility(manager.id)}
                      className="flex items-center gap-1"
                    >
                      {visiblePasswords.has(manager.id) ? (
                        <>
                          <EyeOff className="h-3 w-3" />
                          <span className="text-sm font-mono">
                            {generatedPasswords.get(manager.id)}
                          </span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          <span className="text-sm">Show Password</span>
                        </>
                      )}
                    </Button>
                    <Badge variant="outline" className="text-xs text-green-600">
                      Generated
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Protected Hash
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {manager.force_password_change ? '(Change Required)' : '(Secure)'}
                  </span>
                </div>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Regenerate Password
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Regenerate Password</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to generate a new password for {manager.first_name} {manager.last_name}? 
                      Their current password will no longer work.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onRegeneratePassword(manager)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Generate New Password
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Team Assignments */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Team Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <Label>Select Teams</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto border rounded-md p-4">
                  {teams.length === 0 ? (
                    <p className="text-sm text-gray-500 col-span-full">No teams available</p>
                  ) : (
                    teams.map((team) => (
                      <div key={team.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`team-${team.id}`}
                          checked={form.watch('team_ids')?.includes(team.id) || false}
                          onCheckedChange={(checked) => {
                            const currentValues = form.getValues('team_ids') || [];
                            if (checked) {
                              form.setValue('team_ids', [...currentValues, team.id]);
                            } else {
                              form.setValue('team_ids', currentValues.filter(id => id !== team.id));
                            }
                          }}
                        />
                        <label 
                          htmlFor={`team-${team.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {team.name}
                        </label>
                        {team.description && (
                          <span className="text-xs text-gray-500">
                            - {team.description}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Selected: {form.watch('team_ids')?.length || 0} team(s)
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Assigned Teams:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {assignedTeams.length === 0 ? (
                    <Badge variant="outline">No teams assigned</Badge>
                  ) : (
                    assignedTeams.map(teamId => {
                      const team = teams.find(t => t.id === teamId);
                      return (
                        <Badge key={teamId} variant="secondary">
                          {team?.name || 'Unknown Team'}
                        </Badge>
                      );
                    })
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {getAssignedTeamNames()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};