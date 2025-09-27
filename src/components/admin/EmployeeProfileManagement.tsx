import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Upload, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Building, 
  Users, 
  Camera,
  FileText,
  CheckCircle,
  AlertCircle,
  UserCheck,
  IdCard
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  team: z.string().optional(),
  manager_name: z.string().optional(),
  hire_date: z.string().optional(),
});

interface EmployeeProfile {
  id: string;
  employee_id: string;
  onboarding_form_id: string | null;
  profile_photo_url: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  department: string | null;
  team: string | null;
  manager_name: string | null;
  hire_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const EmployeeProfileManagement = () => {
  const [profiles, setProfiles] = useState<EmployeeProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<EmployeeProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<EmployeeProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    recentlyAdded: 0
  });
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      team: "",
      manager_name: "",
      hire_date: "",
    },
  });

  useEffect(() => {
    const initializeData = async () => {
      await fetchProfiles();
      // Auto-sync on first load
      setTimeout(() => {
        syncWithOnboardingForms();
      }, 500);
    };
    initializeData();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [profiles, searchTerm]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProfiles(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
        toast({
          title: "Error",
          description: "Failed to fetch rep profiles",
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };

  const syncWithOnboardingForms = async () => {
    try {
      setIsLoading(true);
      
      // Get all onboarding forms (all statuses) that don't have employee profiles
      const { data: onboardingForms, error: onboardingError } = await supabase
        .from('onboarding_forms')
        .select(`
          id, first_name, last_name, status, generated_email, personal_email, 
          cell_phone, employee_role, badge_photo_url, created_at
        `)
        .in('status', ['submitted', 'in_progress', 'draft']);

      if (onboardingError) throw onboardingError;

      // Get existing profiles to check which forms already have profiles
      const { data: existingProfiles, error: profileError } = await supabase
        .from('employee_profiles')
        .select('onboarding_form_id')
        .not('onboarding_form_id', 'is', null);

      if (profileError) throw profileError;

      const existingFormIds = new Set(existingProfiles?.map(p => p.onboarding_form_id) || []);
      
      // Filter forms that don't have profiles yet
      const formsNeedingProfiles = (onboardingForms || []).filter(
        form => !existingFormIds.has(form.id)
      );

      if (formsNeedingProfiles.length === 0) {
        toast({
          title: "No New Forms",
          description: "All onboarding forms already have rep profiles",
        });
        return;
      }

      // Create employee profiles for these forms
      const profilesToCreate = formsNeedingProfiles.map(form => ({
        onboarding_form_id: form.id,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.generated_email || form.personal_email || null,
        phone: form.cell_phone || null,
        position: form.employee_role || null,
        hire_date: new Date().toISOString().split('T')[0],
        employee_id: '', // Will be auto-generated by database trigger
        profile_photo_url: form.badge_photo_url || null,
        is_active: form.status === 'submitted' // Active if submitted, inactive if still in progress
      }));

      const { error: insertError } = await supabase
        .from('employee_profiles')
        .insert(profilesToCreate);

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: `Created ${profilesToCreate.length} rep profile(s) from onboarding forms`,
      });
      
      await fetchProfiles(); // Refresh the list
    } catch (error) {
      console.error('Error syncing with onboarding forms:', error);
      toast({
        title: "Error",
        description: "Failed to sync with onboarding forms",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (profileData: EmployeeProfile[]) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const stats = {
      total: profileData.length,
      active: profileData.filter(p => p.is_active).length,
      inactive: profileData.filter(p => !p.is_active).length,
      recentlyAdded: profileData.filter(p => new Date(p.created_at) > oneWeekAgo).length,
    };
    setStats(stats);
  };

  const filterProfiles = () => {
    if (!searchTerm) {
      setFilteredProfiles(profiles);
      return;
    }

    const filtered = profiles.filter(profile => 
      profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (profile.email && profile.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (profile.position && profile.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (profile.department && profile.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProfiles(filtered);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const uploadProfilePhoto = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('employee-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('employee-documents')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile photo",
        variant: "destructive",
      });
      return null;
    }
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      let photoUrl = editingProfile?.profile_photo_url || null;

      if (selectedFile) {
        photoUrl = await uploadProfilePhoto(selectedFile);
        if (!photoUrl) return; // Upload failed
      }

      const profileData = {
        ...values,
        profile_photo_url: photoUrl,
        hire_date: values.hire_date || new Date().toISOString().split('T')[0],
        employee_id: '', // Will be auto-generated by database trigger
      };

      if (editingProfile) {
        const { error } = await supabase
          .from('employee_profiles')
          .update(profileData)
          .eq('id', editingProfile.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Rep profile updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('employee_profiles')
          .insert([profileData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Rep profile created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingProfile(null);
      setSelectedFile(null);
      form.reset();
      fetchProfiles();
    } catch (error) {
      console.error('Error saving profile:', error);
        toast({
          title: "Error",
          description: "Failed to save rep profile",
          variant: "destructive",
        });
    }
  };

  const handleEdit = (profile: EmployeeProfile) => {
    setEditingProfile(profile);
    form.reset({
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email || "",
      phone: profile.phone || "",
      position: profile.position || "",
      department: profile.department || "",
      team: profile.team || "",
      manager_name: profile.manager_name || "",
      hire_date: profile.hire_date || "",
    });
    setIsDialogOpen(true);
  };

  const openDialog = () => {
    setEditingProfile(null);
    setSelectedFile(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const toggleActiveStatus = async (profile: EmployeeProfile) => {
    try {
      const { error } = await supabase
        .from('employee_profiles')
        .update({ is_active: !profile.is_active })
        .eq('id', profile.id);

      if (error) throw error;

        toast({
          title: "Success",
          description: `Rep ${profile.is_active ? 'deactivated' : 'activated'} successfully`,
        });

      fetchProfiles();
    } catch (error) {
      console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: "Failed to update rep status",
          variant: "destructive",
        });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading rep profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.total}</p>
                <p className="text-sm sm:text-base text-muted-foreground">Total Reps</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-success">{stats.active}</p>
                <p className="text-sm sm:text-base text-muted-foreground">Active</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-muted/50 to-muted/25 border-muted/40 hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-muted-foreground">{stats.inactive}</p>
                <p className="text-sm sm:text-base text-muted-foreground">Inactive</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted/40 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.recentlyAdded}</p>
                <p className="text-sm sm:text-base text-muted-foreground">New This Week</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Rep Profiles</CardTitle>
              <CardDescription className="text-sm">Manage rep information and photos</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={syncWithOnboardingForms}
                variant="outline" 
                className="w-full sm:w-auto"
              >
                <FileText className="h-4 w-4 mr-2" />
                Sync From Onboarding
              </Button>
              <Button onClick={openDialog} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Rep
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search reps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({stats.inactive})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <ProfileGrid profiles={filteredProfiles} onEdit={handleEdit} onToggleStatus={toggleActiveStatus} />
            </TabsContent>
            
            <TabsContent value="active" className="mt-6">
              <ProfileGrid 
                profiles={filteredProfiles.filter(p => p.is_active)} 
                onEdit={handleEdit} 
                onToggleStatus={toggleActiveStatus} 
              />
            </TabsContent>
            
            <TabsContent value="inactive" className="mt-6">
              <ProfileGrid 
                profiles={filteredProfiles.filter(p => !p.is_active)} 
                onEdit={handleEdit} 
                onToggleStatus={toggleActiveStatus} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProfile ? 'Edit Rep Profile' : 'Create Rep Profile'}</DialogTitle>
            <DialogDescription>
              {editingProfile ? 'Update rep information and photo' : 'Add a new rep to the system with auto-generated rep ID'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Photo Upload Section */}
              <div className="space-y-4">
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {(selectedFile || editingProfile?.profile_photo_url) ? (
                      <img
                        src={selectedFile ? URL.createObjectURL(selectedFile) : editingProfile?.profile_photo_url || ''}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-border"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Maximum file size: 5MB</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
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
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter position" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter department" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter team" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manager_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter manager name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hire_date"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Hire Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="sm:flex-1">
                  {editingProfile ? 'Update Rep Profile' : 'Create Rep Profile'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="sm:flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ProfileGridProps {
  profiles: EmployeeProfile[];
  onEdit: (profile: EmployeeProfile) => void;
  onToggleStatus: (profile: EmployeeProfile) => void;
}

const ProfileGrid: React.FC<ProfileGridProps> = ({ profiles, onEdit, onToggleStatus }) => {
  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No reps found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};

interface ProfileCardProps {
  profile: EmployeeProfile;
  onEdit: (profile: EmployeeProfile) => void;
  onToggleStatus: (profile: EmployeeProfile) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEdit, onToggleStatus }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'border-success/20 bg-gradient-to-br from-success/5 to-success/2'
      : 'border-muted/40 bg-muted/10';
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 ${getStatusColor(profile.is_active)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              {profile.profile_photo_url ? (
                <img
                  src={profile.profile_photo_url}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
                  <User className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                profile.is_active ? 'bg-success' : 'bg-muted-foreground'
              }`}></div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground truncate">
                {profile.first_name} {profile.last_name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <IdCard className="h-3 w-3 text-primary" />
                <span className="text-sm font-mono text-primary/80 font-medium">
                  Rep ID: {profile.employee_id}
                </span>
              </div>
              {profile.onboarding_form_id && (
                <Badge variant="outline" className="text-xs mt-1">
                  From Onboarding
                </Badge>
              )}
            </div>
          </div>
          <Badge variant={profile.is_active ? "default" : "secondary"} className="text-xs">
            {profile.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Email */}
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
          {profile.email ? (
            <span className="text-sm text-foreground truncate">{profile.email}</span>
          ) : (
            <span className="text-sm text-muted-foreground">No email</span>
          )}
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-green-500 flex-shrink-0" />
          {profile.phone ? (
            <span className="text-sm text-foreground">{profile.phone}</span>
          ) : (
            <span className="text-sm text-muted-foreground">No phone</span>
          )}
        </div>

        {/* Position */}
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-purple-500 flex-shrink-0" />
          {profile.position ? (
            <span className="text-sm text-foreground truncate">{profile.position}</span>
          ) : (
            <span className="text-sm text-muted-foreground">No position</span>
          )}
        </div>

        {/* Department & Team */}
        {(profile.department || profile.team) && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span className="text-sm text-foreground truncate">
              {[profile.department, profile.team].filter(Boolean).join(' • ')}
            </span>
          </div>
        )}

        {/* Hire Date */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Hired: {formatDate(profile.hire_date)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3">
          <Button
            onClick={() => onEdit(profile)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            onClick={() => onToggleStatus(profile)}
            variant={profile.is_active ? "outline" : "default"}
            size="sm"
            className="flex-1"
          >
            {profile.is_active ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeProfileManagement;