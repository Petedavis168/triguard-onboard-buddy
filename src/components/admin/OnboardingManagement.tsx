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
      {/* Compact Card View - Removes desktop table to keep everything unified */}
      <div className="h-full overflow-y-auto">
        <div className="space-y-1 px-4 pb-4">
          {forms.map((form) => (
            <div key={form.id} className="bg-white rounded-md border border-border/30 hover:shadow-sm transition-shadow">
              <div className="p-3">
                {/* Compact Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-foreground truncate">
                        {form.first_name} {form.last_name}
                      </div>
                      {form.generated_email && (
                        <div className="text-xs text-muted-foreground truncate">
                          {form.generated_email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {getStatusBadge(form.status, form.current_step)}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewDetails(form)}
                      className="h-7 w-7 p-0 hover:bg-blue-50"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Compact Assignment Info */}
                {(form.managers || form.teams) && (
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    {form.managers && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{form.managers.first_name} {form.managers.last_name}</span>
                      </div>
                    )}
                    {form.teams && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{form.teams.name}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Compact Date Info */}
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Started: {formatDate(form.created_at)}</span>
                  {form.submitted_at && (
                    <span>Completed: {formatDate(form.submitted_at)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingManagement;