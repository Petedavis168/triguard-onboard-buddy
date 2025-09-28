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
    <div className="space-y-6 bg-gradient-to-br from-gray-50/80 to-blue-50/40 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <Card className="overflow-hidden border-2 border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-emerald-100/60 hover:from-emerald-100/90 hover:to-emerald-150/70 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-1">{stats.total}</p>
                <p className="text-sm font-semibold text-emerald-600">Total Applications</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <FileText className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-2 border-green-200/60 bg-gradient-to-br from-green-50/80 to-green-100/60 hover:from-green-100/90 hover:to-green-150/70 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-green-600"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-green-700 mb-1">{stats.completed}</p>
                <p className="text-sm font-semibold text-green-600">Completed</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-2 border-blue-200/60 bg-gradient-to-br from-blue-50/80 to-blue-100/60 hover:from-blue-100/90 hover:to-blue-150/70 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-blue-700 mb-1">{stats.inProgress}</p>
                <p className="text-sm font-semibold text-blue-600">In Progress</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-2 border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-orange-100/60 hover:from-amber-100/90 hover:to-orange-150/70 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-600"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-orange-700 mb-1">{stats.draft}</p>
                <p className="text-sm font-semibold text-orange-600">Draft</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                <AlertCircle className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="overflow-hidden border-2 border-gray-200/60 bg-gradient-to-br from-white to-gray-50/80 shadow-2xl">
        <CardHeader className="pb-6 bg-gradient-to-r from-gray-50/80 to-white/60 border-b border-gray-200/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Review and manage applications</CardTitle>
              <CardDescription className="text-gray-600 font-medium">Track onboarding progress across all departments</CardDescription>
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by name, email, manager, or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-xl shadow-sm text-gray-900 placeholder-gray-500 font-medium"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-2 bg-gray-100/80 rounded-2xl border-2 border-gray-200/50 shadow-inner">
              <TabsTrigger 
                value="all" 
                className="text-sm px-4 py-3 font-semibold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-gray-900 data-[state=active]:border-2 data-[state=active]:border-gray-200/60 transition-all duration-300"
              >
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="text-sm px-4 py-3 font-semibold rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:shadow-lg data-[state=active]:text-white transition-all duration-300"
              >
                Done ({stats.completed})
              </TabsTrigger>
              <TabsTrigger 
                value="in_progress" 
                className="text-sm px-4 py-3 font-semibold rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:shadow-lg data-[state=active]:text-white transition-all duration-300"
              >
                Active ({stats.inProgress})
              </TabsTrigger>
              <TabsTrigger 
                value="draft" 
                className="text-sm px-4 py-3 font-semibold rounded-xl data-[state=active]:bg-amber-500 data-[state=active]:shadow-lg data-[state=active]:text-white transition-all duration-300"
              >
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
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg px-3 py-1.5 font-semibold text-xs">
            ✓ Complete
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg px-3 py-1.5 font-semibold text-xs">
            Step {currentStep}/9
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg px-3 py-1.5 font-semibold text-xs">
            ◯ Draft
          </Badge>
        );
      default:
        return <Badge variant="outline" className="font-semibold">{status}</Badge>;
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
        return 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 hover:from-emerald-100/90 hover:to-emerald-150/60 shadow-emerald-100/50';
      case 'in_progress':
        return 'border-blue-200/80 bg-gradient-to-br from-blue-50/80 to-blue-100/40 hover:from-blue-100/90 hover:to-blue-150/60 shadow-blue-100/50';
      case 'draft':
        return 'border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-orange-100/40 hover:from-amber-100/90 hover:to-orange-150/60 shadow-amber-100/50';
      default:
        return 'border-gray-200 bg-gradient-to-br from-white to-gray-50/80 hover:from-gray-50 hover:to-gray-100/80';
    }
  };

  const getProgressPercentage = (status: string, currentStep: number) => {
    if (status === 'completed' || status === 'submitted') return 100;
    if (status === 'draft') return Math.max(22, currentStep * 10); // Show some progress even for drafts
    return Math.round((currentStep / 9) * 100);
  };

  const progress = getProgressPercentage(form.status, form.current_step);

  return (
    <Card className={`group overflow-hidden border-2 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02] ${getStatusColor(form.status)}`}>
      <CardContent className="p-0 relative">
        {/* Top accent line */}
        <div className={`h-1.5 w-full ${
          form.status === 'completed' || form.status === 'submitted' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
          form.status === 'in_progress' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
          'bg-gradient-to-r from-amber-400 to-orange-600'
        }`}></div>

        {/* Header Section */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white/50 ${
                  form.status === 'completed' || form.status === 'submitted' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' :
                  form.status === 'in_progress' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                  'bg-gradient-to-br from-amber-400 to-orange-600'
                }`}>
                  <User className="h-8 w-8 text-white drop-shadow-sm" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${
                  form.status === 'completed' || form.status === 'submitted' ? 'bg-emerald-500' :
                  form.status === 'in_progress' ? 'bg-blue-500' : 'bg-amber-500'
                }`}>
                  {form.status === 'completed' || form.status === 'submitted' ? (
                    <CheckCircle className="h-3 w-3 text-white" />
                  ) : form.status === 'in_progress' ? (
                    <Clock className="h-3 w-3 text-white" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-white" />
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-2 truncate group-hover:text-gray-800 transition-colors">
                  {form.first_name} {form.last_name}
                </h3>
                <div className="flex items-center gap-2 mb-1">
                  <IdCard className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-mono text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                    {form.id.slice(0, 8).toUpperCase()}...
                  </span>
                </div>
              </div>
            </div>
            {getStatusBadge(form.status, form.current_step)}
          </div>

          {/* Progress Section */}
          <div className="mb-5 bg-white/70 rounded-xl p-4 border border-white/50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">Progress</span>
              <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                {progress}%
              </span>
            </div>
            <div className="relative w-full bg-gray-200/60 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-700 shadow-sm ${
                  form.status === 'completed' || form.status === 'submitted' ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600' :
                  form.status === 'in_progress' ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600' :
                  'bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600'
                }`}
                style={{ width: `${progress}%` }}
              >
                {progress > 10 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-6 pb-5 space-y-3">
          {/* Email */}
          <div className="flex items-center gap-4 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Mail className="h-5 w-5 text-white" />
            </div>
            {form.generated_email ? (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-blue-700 truncate">{form.generated_email}</p>
                <p className="text-xs text-gray-600 font-medium">Company Email</p>
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-red-600">No email assigned</p>
                <p className="text-xs text-gray-500">Pending setup</p>
              </div>
            )}
          </div>

          {/* Manager */}
          <div className="flex items-center gap-4 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            {form.managers ? (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-purple-700 truncate">
                  {form.managers.first_name} {form.managers.last_name}
                </p>
                <p className="text-xs text-gray-600 font-medium">Manager</p>
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-red-600">No manager assigned</p>
                <p className="text-xs text-gray-500">Pending assignment</p>
              </div>
            )}
          </div>

          {/* Team */}
          <div className="flex items-center gap-4 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="h-5 w-5 text-white" />
            </div>
            {form.teams ? (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-orange-700 truncate">{form.teams.name}</p>
                <p className="text-xs text-gray-600 font-medium">Team Assignment</p>
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-red-600">No team assigned</p>
                <p className="text-xs text-gray-500">Pending assignment</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50/80 to-white/60 border-t border-gray-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Started</p>
                <p className="text-sm font-bold text-gray-900">{formatDate(form.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-gray-500" />
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Status</p>
                <p className="text-sm font-bold text-gray-900 capitalize">
                  {form.status === 'completed' || form.status === 'submitted' ? 'Complete' : 
                   form.status === 'in_progress' ? 'In Progress' : 'Draft'}
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => onViewDetails(form)}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0"
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