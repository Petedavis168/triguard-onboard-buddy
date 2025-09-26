import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Edit, Trash2, Users, Mail, Phone, Building, UserPlus, Eye, EyeOff, RefreshCw, Clock, Activity } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

const managerSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  team_ids: z.array(z.string()).optional(),
});

type ManagerFormData = z.infer<typeof managerSchema>;

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

interface Recruiter {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const ManagerManagement: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<Manager[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [generatedPasswords, setGeneratedPasswords] = useState<Map<string, string>>(new Map());

  const form = useForm<ManagerFormData>({
    resolver: zodResolver(managerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      team_ids: [],
    },
  });

  useEffect(() => {
    fetchManagers();
    fetchTeams();
    fetchRecruiters();
  }, []);

  useEffect(() => {
    filterManagers();
  }, [managers, searchTerm]);

  const fetchManagers = async () => {
    try {
      const { data: managersData, error: managersError } = await supabase
        .from('managers')
        .select('*')
        .order('created_at', { ascending: false });

      if (managersError) {
        toast({
          title: "Error",
          description: "Failed to fetch managers",
          variant: "destructive"
        });
        return;
      }

      // Fetch team assignments for each manager
      const { data: teamAssignments, error: teamError } = await supabase
        .from('manager_teams')
        .select(`
          manager_id,
          team_id,
          teams:team_id (
            id,
            name,
            description
          )
        `);

      if (teamError) {
        console.error('Error fetching team assignments:', teamError);
      }

      // Combine managers with their assigned teams
      const managersWithTeams = managersData?.map(manager => ({
        ...manager,
        assigned_teams: teamAssignments?.filter(ta => ta.manager_id === manager.id)
          .map(ta => ta.teams).filter(Boolean) || []
      })) || [];

      setManagers(managersWithTeams);
    } catch (error) {
      console.error('Error fetching managers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching teams:', error);
        return;
      }

      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchRecruiters = async () => {
    try {
      const { data, error } = await supabase
        .from('recruiters')
        .select('id, first_name, last_name, email')
        .order('first_name');

      if (error) {
        console.error('Error fetching recruiters:', error);
        return;
      }

      setRecruiters(data || []);
    } catch (error) {
      console.error('Error fetching recruiters:', error);
    }
  };

  const filterManagers = () => {
    if (!searchTerm) {
      setFilteredManagers(managers);
      return;
    }

    const filtered = managers.filter(manager => 
      manager.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredManagers(filtered);
  };

  const onSubmit = async (data: ManagerFormData) => {
    try {
      if (editingManager) {
        // Update manager basic info
        const { error: managerError } = await supabase
          .from('managers')
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingManager.id);

        if (managerError) throw managerError;

        // Update team assignments
        // First, remove existing assignments
        await supabase
          .from('manager_teams')
          .delete()
          .eq('manager_id', editingManager.id);

        // Then add new assignments
        if (data.team_ids && data.team_ids.length > 0) {
          const teamAssignments = data.team_ids.map(teamId => ({
            manager_id: editingManager.id,
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
      } else {
        // Generate password for new manager
        const { data: passwordData, error: passwordError } = await supabase
          .rpc('generate_secure_password');

        if (passwordError) throw passwordError;

        // Hash the password before storing
        const { data: hashedPassword, error: hashError } = await supabase
          .rpc('hash_password', { password: passwordData });

        if (hashError) throw hashError;

        const { data: newManager, error } = await supabase
          .from('managers')
          .insert([{
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password_hash: hashedPassword,
            force_password_change: true,
          }])
          .select()
          .single();

        if (error) throw error;

        // Add team assignments for new manager
        if (data.team_ids && data.team_ids.length > 0) {
          const teamAssignments = data.team_ids.map(teamId => ({
            manager_id: newManager.id,
            team_id: teamId
          }));

          await supabase
            .from('manager_teams')
            .insert(teamAssignments);
        }

        // Store the generated password for admin viewing
        const newGeneratedPasswords = new Map(generatedPasswords);
        newGeneratedPasswords.set(newManager.id, passwordData);
        setGeneratedPasswords(newGeneratedPasswords);

        toast({
          title: "Success",
          description: `Manager created successfully. Password: ${passwordData}`
        });
      }

      setIsDialogOpen(false);
      setEditingManager(null);
      form.reset();
      fetchManagers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save manager",
        variant: "destructive"
      });
    }
  };

  const handleEdit = async (manager: Manager) => {
    setEditingManager(manager);
    
    // Get current team assignments for this manager
    const { data: teamAssignments } = await supabase
      .from('manager_teams')
      .select('team_id')
      .eq('manager_id', manager.id);
    
    const assignedTeamIds = teamAssignments?.map(ta => ta.team_id) || [];
    
    form.reset({
      first_name: manager.first_name,
      last_name: manager.last_name,
      email: manager.email,
      team_ids: assignedTeamIds,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, managerName: string) => {
    try {
      const { error } = await supabase
        .from('managers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${managerName} has been removed successfully`
      });
      
      fetchManagers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete manager",
        variant: "destructive"
      });
    }
  };

  const getTeamNames = (manager: Manager) => {
    if (!manager.assigned_teams || manager.assigned_teams.length === 0) {
      return 'Unassigned';
    }
    return manager.assigned_teams.map(team => team.name).join(', ');
  };

  const promoteToRecruiter = async (manager: Manager) => {
    try {
      // Check if already a recruiter
      const isRecruiter = recruiters.some(r => r.email === manager.email);
      if (isRecruiter) {
        toast({
          title: "Already a Recruiter",
          description: `${manager.first_name} ${manager.last_name} is already a recruiter`,
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('recruiters')
        .insert([{
          first_name: manager.first_name,
          last_name: manager.last_name,
          email: manager.email,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${manager.first_name} ${manager.last_name} has been promoted to recruiter while remaining a manager`
      });
      
      fetchRecruiters();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to promote to recruiter",
        variant: "destructive"
      });
    }
  };

  const isAlsoRecruiter = (email: string) => {
    return recruiters.some(r => r.email === email);
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

  const togglePasswordVisibility = (managerId: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(managerId)) {
      newVisible.delete(managerId);
    } else {
      newVisible.add(managerId);
    }
    setVisiblePasswords(newVisible);
  };

  const regeneratePassword = async (manager: Manager) => {
    try {
      // Generate new password
      const { data: passwordData, error: passwordError } = await supabase
        .rpc('generate_secure_password');

      if (passwordError) throw passwordError;

      // Hash the new password
      const { data: hashedPassword, error: hashError } = await supabase
        .rpc('hash_password', { password: passwordData });

      if (hashError) throw hashError;

      const { error } = await supabase
        .from('managers')
        .update({ 
          password_hash: hashedPassword, 
          force_password_change: true,
          updated_at: new Date().toISOString() 
        })
        .eq('id', manager.id);

      if (error) throw error;

      // Store the generated password for admin viewing
      const newGeneratedPasswords = new Map(generatedPasswords);
      newGeneratedPasswords.set(manager.id, passwordData);
      setGeneratedPasswords(newGeneratedPasswords);

      toast({
        title: "Password Regenerated",
        description: `New password: ${passwordData}. ${manager.first_name} ${manager.last_name} will be prompted to change it on next login.`
      });
      
      fetchManagers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to regenerate password",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading managers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-gray-900">Managers</CardTitle>
              <p className="text-sm text-gray-600">Manage team leaders and their contact information</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search managers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingManager(null);
                    form.reset({
                      first_name: '',
                      last_name: '',
                      email: '',
                      team_ids: [],
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Manager
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingManager ? 'Edit Manager' : 'Add Manager'}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
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
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="team_ids"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Assignments</FormLabel>
                            <FormControl>
                              <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                                {teams.length === 0 ? (
                                  <p className="text-sm text-gray-500">No teams available</p>
                                ) : (
                                  teams.map((team) => (
                                    <div key={team.id} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`team-${team.id}`}
                                        checked={field.value?.includes(team.id) || false}
                                        onCheckedChange={(checked) => {
                                          const currentValues = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentValues, team.id]);
                                          } else {
                                            field.onChange(currentValues.filter(id => id !== team.id));
                                          }
                                        }}
                                      />
                                      <label 
                                        htmlFor={`team-${team.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                      >
                                        {team.name}
                                      </label>
                                    </div>
                                  ))
                                )}
                                <div className="text-xs text-gray-500 pt-2 border-t">
                                  Selected: {field.value?.length || 0} team(s)
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingManager ? 'Update' : 'Create'} Manager
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredManagers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No managers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Manager</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredManagers.map((manager) => (
                    <TableRow key={manager.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {manager.first_name} {manager.last_name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{manager.email}</span>
                        </div>
                      </TableCell>
                       <TableCell>
                         <div className="flex items-center gap-2">
                           {generatedPasswords.has(manager.id) ? (
                             <div className="flex items-center gap-2">
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => togglePasswordVisibility(manager.id)}
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
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 className="h-6 w-6 p-0 ml-2"
                               >
                                 <RefreshCw className="h-3 w-3" />
                               </Button>
                              </AlertDialogTrigger>
                             <AlertDialogContent className="max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Regenerate Password</AlertDialogTitle>
                                <AlertDialogDescription asChild>
                                  <div className="space-y-4">
                                    <p>
                                      Are you sure you want to generate a new password for{' '}
                                      <strong>{manager.first_name} {manager.last_name}</strong>?
                                    </p>
                                    
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                      <p className="text-amber-800 text-sm font-medium mb-2">⚠️ Important:</p>
                                      <ul className="text-amber-700 text-sm space-y-1">
                                        <li>• Their current password will no longer work</li>
                                        <li>• They will be forced to change the password on next login</li>
                                        <li>• Any active sessions will be invalidated</li>
                                      </ul>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                      <p className="text-blue-800 text-sm font-medium mb-2">🔒 Security Requirements:</p>
                                      <ul className="text-blue-700 text-sm space-y-1">
                                        <li>• Password will contain company-relevant words</li>
                                        <li>• Minimum 12 characters with mixed case</li>
                                        <li>• Includes numbers for additional security</li>
                                        <li>• Must be changed by manager on first login</li>
                                      </ul>
                                    </div>
                                  </div>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => regeneratePassword(manager)}
                                  className="bg-orange-600 hover:bg-orange-700"
                                >
                                  Generate New Password
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <Clock className="h-3 w-3 text-green-600" />
                            <span className="text-gray-600">Last login:</span>
                            <span className="font-medium">{formatRelativeTime(manager.last_login_at)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Activity className="h-3 w-3 text-blue-600" />
                            <span className="text-gray-600">Activity:</span>
                            <span className="font-medium">{formatRelativeTime(manager.last_activity_at)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Manager
                          </Badge>
                          {isAlsoRecruiter(manager.email) && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Recruiter
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                       <TableCell>
                         <div className="flex items-center gap-2">
                           <Building className="h-4 w-4 text-gray-400" />
                           <span className="text-sm">{getTeamNames(manager)}</span>
                         </div>
                       </TableCell>
                      <TableCell>{formatDate(manager.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {!isAlsoRecruiter(manager.email) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => promoteToRecruiter(manager)}
                              title="Also make this person a recruiter"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(manager)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Manager</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {manager.first_name} {manager.last_name}? 
                                  {isAlsoRecruiter(manager.email) && " They will still remain as a recruiter."}
                                  This action cannot be undone and may affect tasks and assignments.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(manager.id, `${manager.first_name} ${manager.last_name}`)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Remove Manager
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};