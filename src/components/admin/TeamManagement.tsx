import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Edit, Trash2, Building, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const teamSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
  description: z.string().optional(),
});

type TeamFormData = z.infer<typeof teamSchema>;

interface Team {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  recruit_count?: number;
}

export const TeamManagement: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [teams, searchTerm]);

  const fetchTeams = async () => {
    try {
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('name');

      if (teamsError) {
        toast({
          title: "Error",
          description: "Failed to fetch teams",
          variant: "destructive"
        });
        return;
      }

      // Fetch recruit counts for each team
      const { data: recruitCounts, error: countError } = await supabase
        .from('onboarding_forms')
        .select('team_id')
        .not('team_id', 'is', null);

      if (countError) {
        console.error('Error fetching recruit counts:', countError);
      }

      // Add recruit counts to teams
      const teamsWithCounts = teamsData?.map(team => ({
        ...team,
        recruit_count: recruitCounts?.filter(recruit => recruit.team_id === team.id).length || 0
      })) || [];

      setTeams(teamsWithCounts);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTeams = () => {
    if (!searchTerm) {
      setFilteredTeams(teams);
      return;
    }

    const filtered = teams.filter(team => 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (team.description && team.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredTeams(filtered);
  };

  const onSubmit = async (data: TeamFormData) => {
    try {
      if (editingTeam) {
        const { error } = await supabase
          .from('teams')
          .update({
            name: data.name,
            description: data.description || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTeam.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Team updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('teams')
          .insert([{
            name: data.name,
            description: data.description || null,
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Team created successfully"
        });
      }

      setIsDialogOpen(false);
      setEditingTeam(null);
      form.reset();
      fetchTeams();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save team",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    form.reset({
      name: team.name,
      description: team.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, teamName: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${teamName} team has been removed successfully`
      });
      
      fetchTeams();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete team",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-gray-900">Teams</CardTitle>
              <p className="text-sm text-gray-600">Manage organizational teams and departments</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingTeam(null);
                    form.reset({
                      name: '',
                      description: '',
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingTeam ? 'Edit Team' : 'Add Team'}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Installation Team, Sales Team" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Brief description of the team's responsibilities..."
                                rows={3}
                              />
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
                          {editingTeam ? 'Update' : 'Create'} Team
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
          {filteredTeams.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No teams found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on Mobile */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Team Name</TableHead>
                       <TableHead>Description</TableHead>
                       <TableHead>Recruits</TableHead>
                       <TableHead>Created</TableHead>
                       <TableHead>Updated</TableHead>
                       <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                  <TableBody>
                    {filteredTeams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <Building className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="font-medium">{team.name}</span>
                          </div>
                        </TableCell>
                         <TableCell>
                           <div className="max-w-xs truncate text-sm text-gray-600">
                             {team.description || 'No description'}
                           </div>
                         </TableCell>
                         <TableCell>
                           <div className="flex items-center gap-2">
                             <Users className="h-4 w-4 text-blue-600" />
                             <span className="font-medium text-blue-600">
                               {team.recruit_count || 0}
                             </span>
                             <span className="text-sm text-gray-500">recruits</span>
                           </div>
                         </TableCell>
                        <TableCell>{formatDate(team.created_at)}</TableCell>
                        <TableCell>{formatDate(team.updated_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(team)}
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
                                  <AlertDialogTitle>Remove Team</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove the "{team.name}" team? 
                                    This action cannot be undone and may affect managers and tasks assigned to this team.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(team.id, team.name)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Remove Team
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

              {/* Mobile Card View - Visible on Mobile Only */}
              <div className="md:hidden space-y-4">
                {filteredTeams.map((team) => (
                  <Card key={team.id} className="mobile-card">
                    <CardContent className="p-4">
                      {/* Header with Team Name and Icon */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Building className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-base">
                              {team.name}
                            </div>
                          </div>
                        </div>
                        
                        {/* Recruit Count Badge */}
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-600 text-sm">
                            {team.recruit_count || 0}
                          </span>
                          <span className="text-xs text-blue-500">recruits</span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Description</div>
                        <div className="text-sm text-foreground">
                          {team.description || 'No description'}
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="space-y-2 mb-3">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Created: </span>
                          <span className="font-medium">{formatDate(team.created_at)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Updated: </span>
                          <span className="font-medium">{formatDate(team.updated_at)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(team)}
                          className="mobile-button"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Team
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mobile-button text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Team</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove the "{team.name}" team? 
                                This action cannot be undone and may affect managers and tasks assigned to this team.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(team.id, team.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Remove Team
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};