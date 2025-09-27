import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, FileText, Users, CheckCircle, Clock, AlertCircle, Mail, MapPin, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import SubmissionDetailsDialog from './SubmissionDetailsDialog';

interface OnboardingForm {
  id: string;
  first_name: string;
  last_name: string;
  generated_email: string | null;
  status: string;
  current_step: number;
  created_at: string;
  submitted_at: string | null;
  voice_recording_url: string | null;
  voice_recording_completed_at: string | null;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  shipping_street_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip_code: string | null;
  gender: string;
  shirt_size: string;
  coat_size: string;
  pant_size: string;
  shoe_size: string;
  hat_size: string;
  team_id: string | null;
  manager_id: string | null;
  managers?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  teams?: {
    name: string;
  };
}

const OnboardingManagement = () => {
  const [forms, setForms] = useState<OnboardingForm[]>([]);
  const [filteredForms, setFilteredForms] = useState<OnboardingForm[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    draft: 0
  });
  const [selectedSubmission, setSelectedSubmission] = useState<OnboardingForm | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    filterForms();
  }, [forms, searchTerm]);

  const fetchForms = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_forms')
        .select(`
          *,
          managers (
            first_name,
            last_name,
            email
          ),
          teams (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setForms(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast({
        title: "Error",
        description: "Failed to fetch onboarding forms",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (formData: OnboardingForm[]) => {
    const stats = {
      total: formData.length,
      completed: formData.filter(f => f.status === 'completed' || f.status === 'submitted').length,
      inProgress: formData.filter(f => f.status === 'in_progress').length,
      draft: formData.filter(f => f.status === 'draft').length,
    };
    setStats(stats);
  };

  const filterForms = () => {
    if (!searchTerm) {
      setFilteredForms(forms);
      return;
    }

    const filtered = forms.filter(form => 
      form.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (form.generated_email && form.generated_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      form.managers?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.managers?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.teams?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredForms(filtered);
  };

  const getStatusBadge = (status: string, currentStep: number) => {
    switch (status) {
      case 'completed':
      case 'submitted':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">Step {currentStep} of 9</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const viewDetails = (form: OnboardingForm) => {
    setSelectedSubmission(form);
    setIsDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setIsDetailsOpen(false);
    setSelectedSubmission(null);
  };

  const handleSubmissionUpdate = () => {
    fetchForms(); // Refresh the data
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-optimized Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Applications</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Done</CardTitle>
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Finished</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Active</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Draft</CardTitle>
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-gray-600">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">Not Started</p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile-optimized Main Content */}
      <Card className="shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Onboarding Submissions</CardTitle>
              <CardDescription className="text-sm">
                Review and manage employee applications
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 min-h-[44px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            {/* Mobile-optimized tabs */}
            <div className="px-4 sm:px-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 rounded-lg mb-4">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  All <span className="hidden xs:inline">({stats.total})</span>
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs sm:text-sm">
                  Done <span className="hidden xs:inline">({stats.completed})</span>
                </TabsTrigger>
                <TabsTrigger value="in_progress" className="text-xs sm:text-sm">
                  Active <span className="hidden xs:inline">({stats.inProgress})</span>
                </TabsTrigger>
                <TabsTrigger value="draft" className="text-xs sm:text-sm">
                  Draft <span className="hidden xs:inline">({stats.draft})</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <ApplicationList forms={filteredForms} onViewDetails={viewDetails} />
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <ApplicationList 
                forms={filteredForms.filter(f => f.status === 'completed' || f.status === 'submitted')} 
                onViewDetails={viewDetails}
              />
            </TabsContent>
            
            <TabsContent value="in_progress" className="mt-0">
              <ApplicationList 
                forms={filteredForms.filter(f => f.status === 'in_progress')} 
                onViewDetails={viewDetails}
              />
            </TabsContent>
            
            <TabsContent value="draft" className="mt-0">
              <ApplicationList 
                forms={filteredForms.filter(f => f.status === 'draft')} 
                onViewDetails={viewDetails}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <SubmissionDetailsDialog
        submission={selectedSubmission}
        isOpen={isDetailsOpen}
        onClose={handleDetailsClose}
        onUpdate={handleSubmissionUpdate}
      />
    </div>
  );
};

interface ApplicationListProps {
  forms: OnboardingForm[];
  onViewDetails: (form: OnboardingForm) => void;
}

// Mobile-optimized card-based view instead of table
const ApplicationList: React.FC<ApplicationListProps> = ({ forms, onViewDetails }) => {
  const getStatusBadge = (status: string, currentStep: number) => {
    switch (status) {
      case 'completed':
      case 'submitted':
        return <Badge className="bg-green-600 text-xs">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="text-xs">Step {currentStep}/9</Badge>;
      case 'draft':
        return <Badge variant="outline" className="text-xs">Draft</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (forms.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No applications found</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form) => (
                <TableRow key={form.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {form.first_name} {form.last_name}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {form.generated_email || 'Not generated'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {form.managers ? 
                        `${form.managers.first_name} ${form.managers.last_name}` : 
                        'Not assigned'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {form.teams?.name || 'Not assigned'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(form.status, form.current_step)}
                  </TableCell>
                  <TableCell>{formatDate(form.created_at)}</TableCell>
                  <TableCell>{formatDate(form.submitted_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails(form)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="divide-y divide-gray-100">
          {forms.map((form) => (
            <div key={form.id} className="p-4 sm:p-6 hover:bg-gray-50/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 truncate">
                      {form.first_name} {form.last_name}
                    </h3>
                  </div>
                  {form.generated_email && (
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600 truncate">{form.generated_email}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(form.status, form.current_step)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(form)}
                    className="min-h-[32px] px-3 text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {form.managers && (
                  <div>
                    <span className="text-gray-500">Manager:</span>
                    <p className="text-gray-900 font-medium">
                      {form.managers.first_name} {form.managers.last_name}
                    </p>
                  </div>
                )}
                {form.teams && (
                  <div>
                    <span className="text-gray-500">Team:</span>
                    <p className="text-gray-900 font-medium">{form.teams.name}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Started:</span>
                  <p className="text-gray-900 font-medium">{formatDate(form.created_at)}</p>
                </div>
                {form.submitted_at && (
                  <div>
                    <span className="text-gray-500">Completed:</span>
                    <p className="text-gray-900 font-medium">{formatDate(form.submitted_at)}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingManagement;