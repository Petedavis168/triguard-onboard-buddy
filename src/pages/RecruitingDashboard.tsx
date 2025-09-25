import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  UserCheck,
  FileText,
  DollarSign
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingSubmission {
  id: string;
  first_name: string;
  last_name: string;
  generated_email: string;
  personal_email: string;
  cell_phone: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  status: 'draft' | 'in_progress' | 'submitted' | 'completed';
  current_step: number;
  submitted_at: string;
  created_at: string;
  team_name?: string;
  manager_name?: string;
  recruiter_name?: string;
  w9_completed: boolean;
  direct_deposit_confirmed: boolean;
  documents_uploaded_at?: string;
}

const RecruitingDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<OnboardingSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<OnboardingSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<OnboardingSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, statusFilter]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_forms')
        .select(`
          *,
          teams!inner(name),
          managers!inner(first_name, last_name),
          recruiters!inner(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data.map((item: any) => ({
        ...item,
        team_name: item.teams?.name || 'Unassigned',
        manager_name: item.managers ? `${item.managers.first_name} ${item.managers.last_name}` : 'Unassigned',
        recruiter_name: item.recruiters ? `${item.recruiters.first_name} ${item.recruiters.last_name}` : 'Unassigned',
      }));

      setSubmissions(formattedData);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.generated_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.personal_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }

    setFilteredSubmissions(filtered);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { color: 'bg-gray-500', icon: Clock, label: 'Draft' },
      in_progress: { color: 'bg-blue-500', icon: Clock, label: 'In Progress' },
      submitted: { color: 'bg-green-500', icon: CheckCircle, label: 'Submitted' },
      completed: { color: 'bg-purple-500', icon: UserCheck, label: 'Completed' },
    };

    const variant = variants[status as keyof typeof variants] || variants.draft;
    const Icon = variant.icon;

    return (
      <Badge className={`${variant.color} text-white flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {variant.label}
      </Badge>
    );
  };

  const getCompletionRate = (submission: OnboardingSubmission) => {
    const totalSteps = 11;
    return Math.round((submission.current_step / totalSteps) * 100);
  };

  const stats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === 'submitted').length,
    in_progress: submissions.filter(s => s.status === 'in_progress').length,
    completed: submissions.filter(s => s.status === 'completed').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/70 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading submissions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/70 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Recruiting Dashboard</h1>
              <p className="text-muted-foreground">Manage onboarding submissions and track progress</p>
            </div>
          </div>
          <Button variant="premium" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="text-2xl font-bold text-green-600">{stats.submitted}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.in_progress}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredSubmissions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div 
                  key={submission.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Employee Info */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                          {submission.first_name[0]}{submission.last_name[0]}
                        </div>
                        <div>
                          <p className="font-semibold">{submission.first_name} {submission.last_name}</p>
                          <p className="text-sm text-muted-foreground">{submission.generated_email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {submission.cell_phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {submission.city}, {submission.state}
                      </div>
                    </div>

                    {/* Team & Manager */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Building className="h-3 w-3" />
                        {submission.team_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Manager: {submission.manager_name}
                      </div>
                    </div>

                    {/* Status & Progress */}
                    <div className="lg:col-span-2">
                      <div className="space-y-2">
                        {getStatusBadge(submission.status)}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-primary h-2 rounded-full transition-all" 
                            style={{ width: `${getCompletionRate(submission)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {getCompletionRate(submission)}% Complete
                        </p>
                      </div>
                    </div>

                    {/* Submitted Date */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {submission.submitted_at 
                          ? new Date(submission.submitted_at).toLocaleDateString()
                          : 'Not submitted'
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Recruiter: {submission.recruiter_name}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {selectedSubmission?.first_name} {selectedSubmission?.last_name} - Onboarding Details
                            </DialogTitle>
                          </DialogHeader>
                          
                          {selectedSubmission && (
                            <Tabs defaultValue="overview" className="w-full">
                              <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                                <TabsTrigger value="documents">Documents</TabsTrigger>
                                <TabsTrigger value="payroll">Payroll</TabsTrigger>
                              </TabsList>

                              <TabsContent value="overview" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Contact Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        <span>{selectedSubmission.generated_email}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        <span>{selectedSubmission.cell_phone}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>
                                          {selectedSubmission.street_address}, {selectedSubmission.city}, {selectedSubmission.state} {selectedSubmission.zip_code}
                                        </span>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Assignment</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4" />
                                        <span>{selectedSubmission.team_name}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <UserCheck className="h-4 w-4" />
                                        <span>Manager: {selectedSubmission.manager_name}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>Recruiter: {selectedSubmission.recruiter_name}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Onboarding Progress</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center">
                                        <span>Overall Progress</span>
                                        <span className="font-semibold">{getCompletionRate(selectedSubmission)}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div 
                                          className="bg-gradient-primary h-3 rounded-full transition-all" 
                                          style={{ width: `${getCompletionRate(selectedSubmission)}%` }}
                                        />
                                      </div>
                                      <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4" />
                                          <span>W9: {selectedSubmission.w9_completed ? '✓' : '✗'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <DollarSign className="h-4 w-4" />
                                          <span>Direct Deposit: {selectedSubmission.direct_deposit_confirmed ? '✓' : '✗'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4" />
                                          <span>Documents: {selectedSubmission.documents_uploaded_at ? '✓' : '✗'}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              <TabsContent value="personal">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                  </CardHeader>
                                  <CardContent className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="font-semibold">Full Name:</label>
                                      <p>{selectedSubmission.first_name} {selectedSubmission.last_name}</p>
                                    </div>
                                    <div>
                                      <label className="font-semibold">Personal Email:</label>
                                      <p>{selectedSubmission.personal_email}</p>
                                    </div>
                                    <div>
                                      <label className="font-semibold">Phone:</label>
                                      <p>{selectedSubmission.cell_phone}</p>
                                    </div>
                                    <div>
                                      <label className="font-semibold">Address:</label>
                                      <p>{selectedSubmission.street_address}</p>
                                      <p>{selectedSubmission.city}, {selectedSubmission.state} {selectedSubmission.zip_code}</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              <TabsContent value="documents">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Document Status</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className={`p-4 border rounded-lg ${selectedSubmission.w9_completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                                        <h4 className="font-semibold mb-2">W-9 Form</h4>
                                        <p className={`text-sm ${selectedSubmission.w9_completed ? 'text-green-600' : 'text-gray-600'}`}>
                                          {selectedSubmission.w9_completed ? 'Completed' : 'Pending'}
                                        </p>
                                      </div>
                                      <div className={`p-4 border rounded-lg ${selectedSubmission.documents_uploaded_at ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                                        <h4 className="font-semibold mb-2">Identity Documents</h4>
                                        <p className={`text-sm ${selectedSubmission.documents_uploaded_at ? 'text-green-600' : 'text-gray-600'}`}>
                                          {selectedSubmission.documents_uploaded_at ? 'Uploaded' : 'Pending'}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              <TabsContent value="payroll">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Payroll Setup</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className={`p-4 border rounded-lg ${selectedSubmission.direct_deposit_confirmed ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                                      <h4 className="font-semibold mb-2">Direct Deposit</h4>
                                      <p className={`text-sm ${selectedSubmission.direct_deposit_confirmed ? 'text-green-600' : 'text-gray-600'}`}>
                                        {selectedSubmission.direct_deposit_confirmed ? 'Set up and confirmed' : 'Pending setup'}
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}

              {filteredSubmissions.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No submissions match your current filters.' 
                      : 'No submissions found.'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecruitingDashboard;