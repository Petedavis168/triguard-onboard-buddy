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
    <div className="space-y-8 bg-background min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Applications</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground mt-1">Completed</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.inProgress}</p>
                  <p className="text-sm text-muted-foreground mt-1">In Progress</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.draft}</p>
                  <p className="text-sm text-muted-foreground mt-1">Draft</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">Onboarding Applications</CardTitle>
                <CardDescription className="text-muted-foreground">Review and manage all onboarding submissions</CardDescription>
              </div>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, manager, or team..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress ({stats.inProgress})</TabsTrigger>
                <TabsTrigger value="draft">Draft ({stats.draft})</TabsTrigger>
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
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">Step {currentStep} of 9</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
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

  const getProgressPercentage = (status: string, currentStep: number) => {
    if (status === 'completed' || status === 'submitted') return 100;
    if (status === 'draft') return Math.max(11, currentStep * 11);
    return Math.round((currentStep / 9) * 100);
  };

  const progress = getProgressPercentage(form.status, form.current_step);

  return (
    <Card className="border border-border bg-card hover:shadow-md transition-all duration-200 cursor-pointer">
      <CardContent className="p-6 space-y-4">
        {/* Header with name and status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-semibold">
              {form.first_name[0]}{form.last_name[0]}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">
                {form.first_name} {form.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {form.generated_email || 'Email pending'}
              </p>
            </div>
          </div>
          {getStatusBadge(form.status, form.current_step)}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm font-semibold text-foreground">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 gap-3 pt-2 border-t border-border">
          {/* Manager info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <UserCheck className="h-4 w-4 mr-2" />
              Manager
            </div>
            <span className="text-sm font-medium text-foreground">
              {form.managers ? `${form.managers.first_name} ${form.managers.last_name}` : 'Not assigned'}
            </span>
          </div>

          {/* Team info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Building className="h-4 w-4 mr-2" />
              Team
            </div>
            <span className="text-sm font-medium text-foreground">
              {form.teams?.name || 'Not assigned'}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </div>
            <span className="text-sm font-medium text-foreground">
              {form.city && form.state ? `${form.city}, ${form.state}` : 'Not provided'}
            </span>
          </div>

          {/* Started date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Started
            </div>
            <span className="text-sm font-medium text-foreground">
              {formatDate(form.created_at)}
            </span>
          </div>
        </div>

        {/* Action button */}
        <Button 
          onClick={() => onViewDetails(form)}
          className="w-full mt-4"
          variant="outline"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default OnboardingManagement;