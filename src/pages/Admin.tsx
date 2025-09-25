import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { Search, Users, FileText, Mail, Calendar, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OnboardingForm {
  id: string;
  first_name: string;
  last_name: string;
  generated_email: string;
  status: string;
  current_step: number;
  created_at: string;
  submitted_at: string | null;
  team_id: string;
  manager_id: string;
}

export const Admin: React.FC = () => {
  const [forms, setForms] = useState<OnboardingForm[]>([]);
  const [filteredForms, setFilteredForms] = useState<OnboardingForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    draft: 0,
  });

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
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching forms:', error);
        return;
      }

      setForms(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (formData: OnboardingForm[]) => {
    const stats = {
      total: formData.length,
      completed: formData.filter(f => f.status === 'submitted').length,
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
      form.generated_email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredForms(filtered);
  };

  const getStatusBadge = (status: string, currentStep: number) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Step {currentStep}/7</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">TriGuard Roofing - Onboarding Management</p>
          </div>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Onboarding
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
              <Mail className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-xl text-gray-900">Onboarding Applications</CardTitle>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress ({stats.inProgress})</TabsTrigger>
                <TabsTrigger value="draft">Drafts ({stats.draft})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <ApplicationTable forms={filteredForms} />
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                <ApplicationTable forms={filteredForms.filter(f => f.status === 'submitted')} />
              </TabsContent>
              
              <TabsContent value="in_progress" className="mt-0">
                <ApplicationTable forms={filteredForms.filter(f => f.status === 'in_progress')} />
              </TabsContent>
              
              <TabsContent value="draft" className="mt-0">
                <ApplicationTable forms={filteredForms.filter(f => f.status === 'draft')} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ApplicationTable: React.FC<{ forms: OnboardingForm[] }> = ({ forms }) => {
  const getStatusBadge = (status: string, currentStep: number) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Step {currentStep}/7</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
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
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {form.generated_email || 'Pending...'}
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(form.status, form.current_step)}
              </TableCell>
              <TableCell>{formatDate(form.created_at)}</TableCell>
              <TableCell>{formatDate(form.submitted_at)}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Admin;