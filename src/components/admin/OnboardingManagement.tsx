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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Ultra-Compact Stats Grid - Single Row */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-white rounded-lg p-2 shadow-sm border border-border/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
              <FileText className="h-3 w-3 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2 shadow-sm border border-border/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-3 w-3 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-muted-foreground">Done</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2 shadow-sm border border-border/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
              <Clock className="h-3 w-3 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2 shadow-sm border border-border/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
              <AlertCircle className="h-3 w-3 text-gray-600" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-600">{stats.draft}</div>
              <div className="text-xs text-muted-foreground">Draft</div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Main Content */}
      <Card className="flex-1 shadow-md flex flex-col overflow-hidden">
        <CardHeader className="pb-2 px-4 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Onboarding Submissions</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Review and manage applications
              </CardDescription>
            </div>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 h-8 text-sm"
            />
          </div>
        </CardHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="all" className="h-full flex flex-col">
            <div className="px-4">
              <TabsList className="grid w-full grid-cols-4 h-8 rounded-md mb-2">
                <TabsTrigger value="all" className="text-xs py-1">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="completed" className="text-xs py-1">Done ({stats.completed})</TabsTrigger>
                <TabsTrigger value="in_progress" className="text-xs py-1">Active ({stats.inProgress})</TabsTrigger>
                <TabsTrigger value="draft" className="text-xs py-1">Draft ({stats.draft})</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="all" className="h-full mt-0">
                <ApplicationList forms={filteredForms} onViewDetails={viewDetails} />
              </TabsContent>
              
              <TabsContent value="completed" className="h-full mt-0">
                <ApplicationList 
                  forms={filteredForms.filter(f => f.status === 'completed' || f.status === 'submitted')} 
                  onViewDetails={viewDetails}
                />
              </TabsContent>
              
              <TabsContent value="in_progress" className="h-full mt-0">
                <ApplicationList 
                  forms={filteredForms.filter(f => f.status === 'in_progress')} 
                  onViewDetails={viewDetails}
                />
              </TabsContent>
              
              <TabsContent value="draft" className="h-full mt-0">
                <ApplicationList 
                  forms={filteredForms.filter(f => f.status === 'draft')} 
                  onViewDetails={viewDetails}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
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
    <div className="h-full overflow-hidden">
      {/* Easy-to-read Tile Grid */}
      <div className="h-full overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {forms.map((form) => (
            <div key={form.id} className="bg-white rounded-xl border border-border/40 hover:shadow-lg transition-all duration-200 hover:border-blue-200 overflow-hidden">
              <div className="p-5">
                {/* Header Tile Section */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-semibold text-gray-900 leading-tight break-all ${
                        `${form.first_name} ${form.last_name}`.length > 15 ? 'text-sm' : 'text-base'
                      }`}>
                        {form.first_name} {form.last_name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5 truncate">
                        ID: {form.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {getStatusBadge(form.status, form.current_step)}
                  </div>
                </div>

                {/* Email Tile */}
                {form.generated_email && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Email Generated</span>
                    </div>
                    <p className={`text-blue-700 mt-1 font-mono break-all ${
                      form.generated_email.length > 25 ? 'text-xs' : 
                      form.generated_email.length > 20 ? 'text-sm' : 'text-sm'
                    }`}>
                      {form.generated_email}
                    </p>
                  </div>
                )}

                {/* Assignment Tiles */}
                <div className="space-y-2 mb-4">
                  {form.managers && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Manager</span>
                      </div>
                       <div className={`text-green-700 mt-1 break-all ${
                         `${form.managers.first_name} ${form.managers.last_name}`.length > 20 ? 'text-xs' : 'text-sm'
                       }`}>
                         {form.managers.first_name} {form.managers.last_name}
                       </div>
                    </div>
                  )}
                  
                  {form.teams && (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">Team</span>
                      </div>
                      <div className={`text-purple-700 mt-1 break-all ${
                        form.teams.name && form.teams.name.length > 20 ? 'text-xs' : 'text-sm'
                      }`}>
                        {form.teams.name}
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline Tiles */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs font-medium text-gray-600 mb-1">Started</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatDate(form.created_at)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs font-medium text-gray-600 mb-1">Completed</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {form.submitted_at ? formatDate(form.submitted_at) : 'Pending'}
                    </div>
                  </div>
                </div>

                {/* Action Tile */}
                <Button
                  onClick={() => onViewDetails(form)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors shadow-sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Details
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State Tile */}
        {forms.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingManagement;