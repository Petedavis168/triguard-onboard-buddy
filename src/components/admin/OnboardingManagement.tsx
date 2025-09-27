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
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <FileText className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Done</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-muted/50 to-muted/25 border-muted/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-muted-foreground">{stats.draft}</p>
                <p className="text-sm text-muted-foreground">Draft</p>
              </div>
              <AlertCircle className="h-8 w-8 text-muted-foreground/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Onboarding Submissions</CardTitle>
              <CardDescription>Review and manage applications</CardDescription>
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
        
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="completed">Done ({stats.completed})</TabsTrigger>
              <TabsTrigger value="in_progress">Active ({stats.inProgress})</TabsTrigger>
              <TabsTrigger value="draft">Draft ({stats.draft})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <ApplicationTable forms={filteredForms} onViewDetails={viewDetails} />
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              <ApplicationTable 
                forms={filteredForms.filter(f => f.status === 'completed' || f.status === 'submitted')} 
                onViewDetails={viewDetails}
              />
            </TabsContent>
            
            <TabsContent value="in_progress" className="mt-6">
              <ApplicationTable 
                forms={filteredForms.filter(f => f.status === 'in_progress')} 
                onViewDetails={viewDetails}
              />
            </TabsContent>
            
            <TabsContent value="draft" className="mt-6">
              <ApplicationTable 
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

interface ApplicationTableProps {
  forms: OnboardingForm[];
  onViewDetails: (form: OnboardingForm) => void;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({ forms, onViewDetails }) => {
  const getStatusBadge = (status: string, currentStep: number) => {
    switch (status) {
      case 'completed':
      case 'submitted':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">Step {currentStep}/9</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No applications found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => (
            <TableRow key={form.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {form.first_name} {form.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {form.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(form.status, form.current_step)}
              </TableCell>
              <TableCell>
                {form.generated_email ? (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-mono text-blue-600">
                      {form.generated_email}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {form.managers ? (
                  <span className="text-sm">
                    {form.managers.first_name} {form.managers.last_name}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {form.teams ? (
                  <span className="text-sm">{form.teams.name}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm">{formatDate(form.created_at)}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {form.submitted_at ? formatDate(form.submitted_at) : 'Pending'}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => onViewDetails(form)}
                  size="sm"
                  variant="outline"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OnboardingManagement;