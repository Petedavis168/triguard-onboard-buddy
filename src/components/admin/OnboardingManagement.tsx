import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Eye, FileText, Users, CheckCircle, Clock, AlertCircle, Mail, MapPin, User, Calendar, UserCheck, Building, IdCard } from 'lucide-react';
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.total}</p>
                <p className="text-sm sm:text-base text-muted-foreground">Total Applications</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-success">{stats.completed}</p>
                <p className="text-sm sm:text-base text-muted-foreground">Completed</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                <p className="text-sm sm:text-base text-muted-foreground">In Progress</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-muted/50 to-muted/25 border-muted/40 hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-muted-foreground">{stats.draft}</p>
                <p className="text-sm sm:text-base text-muted-foreground">Draft</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted/40 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
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
              <CardTitle className="text-lg sm:text-xl">Onboarding Submissions</CardTitle>
              <CardDescription className="text-sm">Review and manage applications</CardDescription>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
              <TabsTrigger value="all" className="text-xs sm:text-sm px-2 py-2">
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm px-2 py-2">
                Done ({stats.completed})
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="text-xs sm:text-sm px-2 py-2">
                Active ({stats.inProgress})
              </TabsTrigger>
              <TabsTrigger value="draft" className="text-xs sm:text-sm px-2 py-2">
                Draft ({stats.draft})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <ApplicationGrid forms={filteredForms} onViewDetails={viewDetails} />
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              <ApplicationGrid 
                forms={filteredForms.filter(f => f.status === 'completed' || f.status === 'submitted')} 
                onViewDetails={viewDetails}
              />
            </TabsContent>
            
            <TabsContent value="in_progress" className="mt-6">
              <ApplicationGrid 
                forms={filteredForms.filter(f => f.status === 'in_progress')} 
                onViewDetails={viewDetails}
              />
            </TabsContent>
            
            <TabsContent value="draft" className="mt-6">
              <ApplicationGrid 
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

interface ApplicationGridProps {
  forms: OnboardingForm[];
  onViewDetails: (form: OnboardingForm) => void;
}

const ApplicationGrid: React.FC<ApplicationGridProps> = ({ forms, onViewDetails }) => {
  if (forms.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No applications found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {forms.map((form) => (
        <ApplicationCard 
          key={form.id} 
          form={form} 
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

interface ApplicationCardProps {
  form: OnboardingForm;
  onViewDetails: (form: OnboardingForm) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ form, onViewDetails }) => {
  const getStatusBadge = (status: string, currentStep: number) => {
    switch (status) {
      case 'completed':
      case 'submitted':
        return <Badge className="bg-success text-success-foreground font-medium">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-200 font-medium">Step {currentStep}/9</Badge>;
      case 'draft':
        return <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50 font-medium">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'submitted':
        return 'border-success/30 bg-gradient-to-br from-success/8 to-success/3 hover:from-success/12 hover:to-success/5';
      case 'in_progress':
        return 'border-blue-500/30 bg-gradient-to-br from-blue-500/8 to-blue-500/3 hover:from-blue-500/12 hover:to-blue-500/5';
      case 'draft':
        return 'border-amber-200 bg-gradient-to-br from-amber-50 to-amber-25 hover:from-amber-100 hover:to-amber-50';
      default:
        return 'border-border bg-card hover:bg-accent/50';
    }
  };

  const getProgressPercentage = (status: string, currentStep: number) => {
    if (status === 'completed' || status === 'submitted') return 100;
    if (status === 'draft') return 0;
    return Math.round((currentStep / 9) * 100);
  };

  const progress = getProgressPercentage(form.status, form.current_step);

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${getStatusColor(form.status)} border-2`}>
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-5 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg ring-4 ring-primary/10">
                  <User className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white shadow-sm ${
                  form.status === 'completed' || form.status === 'submitted' ? 'bg-success' :
                  form.status === 'in_progress' ? 'bg-blue-500' : 'bg-amber-500'
                }`}></div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-lg text-foreground mb-1 truncate">
                  {form.first_name} {form.last_name}
                </h3>
                <div className="flex items-center gap-2">
                  <IdCard className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-mono text-primary/80 font-medium">
                    Rep ID: {form.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
            {getStatusBadge(form.status, form.current_step)}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-muted-foreground">Progress</span>
              <span className="text-xs font-bold text-foreground">{progress}%</span>
            </div>
            <div className="w-full bg-muted/40 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  form.status === 'completed' || form.status === 'submitted' ? 'bg-gradient-to-r from-success to-success/80' :
                  form.status === 'in_progress' ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                  'bg-gradient-to-r from-amber-400 to-amber-300'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-5 pb-4 space-y-3">
          {/* Email */}
          <div className="flex items-center gap-3 p-2.5 bg-white/60 dark:bg-black/20 rounded-lg">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            {form.generated_email ? (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-blue-600 truncate">{form.generated_email}</p>
                <p className="text-xs text-muted-foreground">Company Email</p>
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">No email assigned</p>
                <p className="text-xs text-muted-foreground">Pending setup</p>
              </div>
            )}
          </div>

          {/* Manager */}
          <div className="flex items-center gap-3 p-2.5 bg-white/60 dark:bg-black/20 rounded-lg">
            <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-purple-600" />
            </div>
            {form.managers ? (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {form.managers.first_name} {form.managers.last_name}
                </p>
                <p className="text-xs text-muted-foreground">Manager</p>
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">No manager assigned</p>
                <p className="text-xs text-muted-foreground">Pending assignment</p>
              </div>
            )}
          </div>

          {/* Team */}
          <div className="flex items-center gap-3 p-2.5 bg-white/60 dark:bg-black/20 rounded-lg">
            <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Building className="h-4 w-4 text-orange-600" />
            </div>
            {form.teams ? (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{form.teams.name}</p>
                <p className="text-xs text-muted-foreground">Team Assignment</p>
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">No team assigned</p>
                <p className="text-xs text-muted-foreground">Pending assignment</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="px-5 py-4 bg-gradient-to-r from-muted/30 to-muted/10 border-t border-border/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">Started</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{formatDate(form.created_at)}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-1 mb-1">
                  <CheckCircle className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">Completed</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {form.submitted_at ? formatDate(form.submitted_at) : 'Pending'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => onViewDetails(form)}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-[1.02]"
            size="lg"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingManagement;