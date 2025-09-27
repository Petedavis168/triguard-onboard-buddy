import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Edit, Trash2, Users, Eye, EyeOff, RotateCcw, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const userSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  is_active: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  force_password_change: boolean;
  last_login_at: string | null;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [generatedPasswords, setGeneratedPasswords] = useState<Record<string, string>>({});
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      is_active: true,
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch admin users",
          variant: "destructive"
        });
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        const { error } = await supabase
          .from('admin_users')
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            is_active: data.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingUser.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Admin user updated successfully"
        });
      } else {
        // Generate password for new admin
        const { data: passwordData, error: passwordError } = await supabase
          .rpc('generate_secure_password');

        if (passwordError) throw passwordError;

        const generatedPassword = passwordData;

        // Hash the password
        const { data: hashedPassword, error: hashError } = await supabase
          .rpc('hash_password', { password: generatedPassword });

        if (hashError) throw hashError;

        const { data: insertData, error } = await supabase
          .from('admin_users')
          .insert([{
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password_hash: hashedPassword,
            is_active: data.is_active,
            force_password_change: true,
          }])
          .select('id')
          .single();

        if (error) throw error;

        // Store the generated password for display
        setGeneratedPasswords(prev => ({
          ...prev,
          [insertData.id]: generatedPassword
        }));

        toast({
          title: "Success",
          description: "Admin user created successfully with generated password"
        });
      }

      setIsDialogOpen(false);
      setEditingUser(null);
      form.reset();
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save admin user",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    form.reset({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      is_active: user.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin user?')) return;

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin user deleted successfully"
      });
      
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete admin user",
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

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const copyPassword = (userId: string) => {
    const password = generatedPasswords[userId];
    if (password) {
      navigator.clipboard.writeText(password);
      toast({
        title: "Copied",
        description: "Password copied to clipboard"
      });
    }
  };

  const regeneratePassword = async (userId: string) => {
    if (!confirm('Are you sure you want to regenerate the password for this admin?')) return;

    try {
      // Generate new password
      const { data: passwordData, error: passwordError } = await supabase
        .rpc('generate_secure_password');

      if (passwordError) throw passwordError;

      const newPassword = passwordData;

      // Hash the password
      const { data: hashedPassword, error: hashError } = await supabase
        .rpc('hash_password', { password: newPassword });

      if (hashError) throw hashError;

      // Update admin with new password
      const { error } = await supabase
        .from('admin_users')
        .update({
          password_hash: hashedPassword,
          force_password_change: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      // Store the new password for display
      setGeneratedPasswords(prev => ({
        ...prev,
        [userId]: newPassword
      }));

      toast({
        title: "Success",
        description: "Password regenerated successfully"
      });

      fetchUsers();
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
        <div className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-gray-900">Admin Users</CardTitle>
              <p className="text-sm text-gray-600">Manage administrator accounts and permissions</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingUser(null);
                    form.reset({
                      first_name: '',
                      last_name: '',
                      email: '',
                      is_active: true,
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingUser ? 'Edit Admin User' : 'Add Admin User'}
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
                        <div className="rounded-lg border p-4 bg-muted/50">
                          <p className="text-sm text-muted-foreground">
                            A secure password will be automatically generated for this admin user.
                            They will be required to change it on first login.
                          </p>
                        </div>
                      <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Active Status</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                User can access admin functions
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingUser ? 'Update' : 'Create'} User
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
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No admin users found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on Mobile */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Password Status</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {generatedPasswords[user.id] && (
                              <div className="flex items-center gap-1 text-xs">
                                <Input
                                  type={visiblePasswords[user.id] ? "text" : "password"}
                                  value={generatedPasswords[user.id]}
                                  readOnly
                                  className="h-7 w-24 text-xs"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => togglePasswordVisibility(user.id)}
                                  className="h-7 w-7 p-0"
                                >
                                  {visiblePasswords[user.id] ? (
                                    <EyeOff className="h-3 w-3" />
                                  ) : (
                                    <Eye className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyPassword(user.id)}
                                  className="h-7 w-7 p-0"
                                  title="Copy password"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                            <Badge variant={user.force_password_change ? "destructive" : "default"}>
                              {user.force_password_change ? 'Must Change' : 'Set'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {user.last_login_at ? (
                              <div>
                                <div>Last: {formatDate(user.last_login_at)}</div>
                                {user.last_activity_at && (
                                  <div className="text-xs text-muted-foreground">
                                    Active: {formatDate(user.last_activity_at)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Never</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? "default" : "secondary"}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => regeneratePassword(user.id)}
                              title="Regenerate Password"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
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

              {/* Mobile Card View - Visible on Mobile Only */}
              <div className="md:hidden space-y-4">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="mobile-card">
                    <CardContent className="p-4">
                      {/* Header with Name and Status */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-base">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      {/* Password Status */}
                      <div className="border-t pt-3 mb-3">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Password Status</div>
                        <div className="flex flex-wrap items-center gap-2">
                          {generatedPasswords[user.id] && (
                            <div className="flex items-center gap-2">
                              <Input
                                type={visiblePasswords[user.id] ? "text" : "password"}
                                value={generatedPasswords[user.id]}
                                readOnly
                                className="h-8 w-32 text-xs mobile-input"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePasswordVisibility(user.id)}
                                className="h-8 w-8 p-0 mobile-button"
                              >
                                {visiblePasswords[user.id] ? (
                                  <EyeOff className="h-3 w-3" />
                                ) : (
                                  <Eye className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyPassword(user.id)}
                                className="h-8 w-8 p-0 mobile-button"
                                title="Copy password"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          <Badge variant={user.force_password_change ? "destructive" : "default"}>
                            {user.force_password_change ? 'Must Change' : 'Set'}
                          </Badge>
                        </div>
                      </div>

                      {/* Activity Information */}
                      <div className="border-t pt-3 mb-3">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Activity</div>
                        <div className="text-sm">
                          {user.last_login_at ? (
                            <div className="space-y-1">
                              <div>Last Login: {formatDate(user.last_login_at)}</div>
                              {user.last_activity_at && (
                                <div className="text-xs text-muted-foreground">
                                  Last Active: {formatDate(user.last_activity_at)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Never logged in</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => regeneratePassword(user.id)}
                          className="mobile-button"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Reset Password
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          className="mobile-button"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="mobile-button text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground mt-3 pt-2 border-t">
                        Created: {formatDate(user.created_at)}
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