import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Edit, Trash2, Users, Mail, Phone, Building } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const managerSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  team_id: z.string().optional(),
});

type ManagerFormData = z.infer<typeof managerSchema>;

interface Manager {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  team_id: string | null;
  created_at: string;
  updated_at: string;
}

interface Team {
  id: string;
  name: string;
  description: string | null;
}

export const ManagerManagement: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<Manager[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);

  const form = useForm<ManagerFormData>({
    resolver: zodResolver(managerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      team_id: '',
    },
  });

  useEffect(() => {
    fetchManagers();
    fetchTeams();
  }, []);

  useEffect(() => {
    filterManagers();
  }, [managers, searchTerm]);

  const fetchManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('managers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch managers",
          variant: "destructive"
        });
        return;
      }

      setManagers(data || []);
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
        const { error } = await supabase
          .from('managers')
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            team_id: data.team_id || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingManager.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Manager updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('managers')
          .insert([{
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            team_id: data.team_id || null,
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Manager created successfully"
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

  const handleEdit = (manager: Manager) => {
    setEditingManager(manager);
    form.reset({
      first_name: manager.first_name,
      last_name: manager.last_name,
      email: manager.email,
      team_id: manager.team_id || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this manager?')) return;

    try {
      const { error } = await supabase
        .from('managers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Manager deleted successfully"
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

  const getTeamName = (teamId: string | null) => {
    if (!teamId) return 'Unassigned';
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unknown Team';
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
                      team_id: '',
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
                        name="team_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Assignment</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a team" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">No Team</SelectItem>
                                {teams.map((team) => (
                                  <SelectItem key={team.id} value={team.id}>
                                    {team.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                    <TableHead>Team</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
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
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{getTeamName(manager.team_id)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(manager.created_at)}</TableCell>
                      <TableCell>{formatDate(manager.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(manager)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(manager.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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