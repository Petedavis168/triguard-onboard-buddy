import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Edit, Trash2, Users, Mail, UserPlus, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { RecruiterDetailsView } from './RecruiterDetailsView';

const recruiterSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type RecruiterFormData = z.infer<typeof recruiterSchema>;

interface Recruiter {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface Manager {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const RecruiterManagement: React.FC = () => {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [filteredRecruiters, setFilteredRecruiters] = useState<Recruiter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecruiter, setEditingRecruiter] = useState<Recruiter | null>(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null);

  const form = useForm<RecruiterFormData>({
    resolver: zodResolver(recruiterSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
    },
  });

  useEffect(() => {
    fetchRecruiters();
    fetchManagers();
  }, []);

  useEffect(() => {
    filterRecruiters();
  }, [recruiters, searchTerm]);

  const fetchRecruiters = async () => {
    try {
      const { data, error } = await supabase
        .from('recruiters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch recruiters",
          variant: "destructive"
        });
        return;
      }

      setRecruiters(data || []);
    } catch (error) {
      console.error('Error fetching recruiters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('managers')
        .select('id, first_name, last_name, email')
        .order('first_name');

      if (error) {
        console.error('Error fetching managers:', error);
        return;
      }

      setManagers(data || []);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const filterRecruiters = () => {
    if (!searchTerm) {
      setFilteredRecruiters(recruiters);
      return;
    }

    const filtered = recruiters.filter(recruiter => 
      recruiter.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecruiters(filtered);
  };

  const onSubmit = async (data: RecruiterFormData) => {
    try {
      if (editingRecruiter) {
        const { error } = await supabase
          .from('recruiters')
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingRecruiter.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Recruiter updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('recruiters')
          .insert([{
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Recruiter created successfully"
        });
      }

      setIsDialogOpen(false);
      setEditingRecruiter(null);
      form.reset();
      fetchRecruiters();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save recruiter",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (recruiter: Recruiter) => {
    setEditingRecruiter(recruiter);
    form.reset({
      first_name: recruiter.first_name,
      last_name: recruiter.last_name,
      email: recruiter.email,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, recruiterName: string) => {
    try {
      const { error } = await supabase
        .from('recruiters')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${recruiterName} has been removed successfully`
      });
      
      fetchRecruiters();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete recruiter",
        variant: "destructive"
      });
    }
  };

  const promoteToManager = async (recruiter: Recruiter) => {
    try {
      // Check if already a manager
      const isManager = managers.some(m => m.email === recruiter.email);
      if (isManager) {
        toast({
          title: "Already a Manager",
          description: `${recruiter.first_name} ${recruiter.last_name} is already a manager`,
          variant: "destructive"
        });
        return;
      }

      // Generate password for new manager
      const { data: passwordData, error: passwordError } = await supabase
        .rpc('generate_secure_password');

      if (passwordError) throw passwordError;

      // Hash the password before storing
      const { data: hashedPassword, error: hashError } = await supabase
        .rpc('hash_password', { password: passwordData });

      if (hashError) throw hashError;

      const { error } = await supabase
        .from('managers')
        .insert([{
          first_name: recruiter.first_name,
          last_name: recruiter.last_name,
          email: recruiter.email,
          password_hash: hashedPassword,
          force_password_change: true,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${recruiter.first_name} ${recruiter.last_name} has been promoted to manager while remaining a recruiter`
      });
      
      fetchManagers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to promote to manager",
        variant: "destructive"
      });
    }
  };

  const isAlsoManager = (email: string) => {
    return managers.some(m => m.email === email);
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

  // If a recruiter is selected, show the detailed view
  if (selectedRecruiter) {
    return (
      <RecruiterDetailsView
        recruiter={selectedRecruiter}
        onBack={() => setSelectedRecruiter(null)}
        onUpdate={fetchRecruiters}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading recruiters...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-gray-900">Recruiters</CardTitle>
              <p className="text-sm text-gray-600">Manage talent acquisition team and their contact information</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search recruiters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingRecruiter(null);
                    form.reset({
                      first_name: '',
                      last_name: '',
                      email: '',
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Recruiter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingRecruiter ? 'Edit Recruiter' : 'Add Recruiter'}
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
                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingRecruiter ? 'Update' : 'Create'} Recruiter
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
          {filteredRecruiters.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recruiters found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recruiter</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                   {filteredRecruiters.map((recruiter) => (
                     <TableRow key={recruiter.id} className="cursor-pointer hover:bg-muted/50">
                       <TableCell onClick={() => setSelectedRecruiter(recruiter)}>
                         <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                             <UserPlus className="h-4 w-4 text-green-600" />
                           </div>
                           <div>
                             <div className="font-medium">
                               {recruiter.first_name} {recruiter.last_name}
                             </div>
                           </div>
                         </div>
                       </TableCell>
                       <TableCell onClick={() => setSelectedRecruiter(recruiter)}>
                         <div className="flex items-center gap-2">
                           <Mail className="h-4 w-4 text-gray-400" />
                           <span className="text-sm">{recruiter.email}</span>
                         </div>
                       </TableCell>
                       <TableCell onClick={() => setSelectedRecruiter(recruiter)}>
                         <div className="flex gap-1">
                           <Badge variant="secondary" className="bg-green-100 text-green-800">
                             Recruiter
                           </Badge>
                           {isAlsoManager(recruiter.email) && (
                             <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                               Manager
                             </Badge>
                           )}
                         </div>
                       </TableCell>
                       <TableCell onClick={() => setSelectedRecruiter(recruiter)}>{formatDate(recruiter.created_at)}</TableCell>
                       <TableCell onClick={() => setSelectedRecruiter(recruiter)}>{formatDate(recruiter.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {!isAlsoManager(recruiter.email) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => promoteToManager(recruiter)}
                              title="Also make this person a manager"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(recruiter)}
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
                                <AlertDialogTitle>Remove Recruiter</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {recruiter.first_name} {recruiter.last_name} from recruiters? 
                                  {isAlsoManager(recruiter.email) && " They will still remain as a manager."}
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(recruiter.id, `${recruiter.first_name} ${recruiter.last_name}`)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Remove Recruiter
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