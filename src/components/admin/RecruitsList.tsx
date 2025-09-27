import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { Users, Mail, Phone, Calendar, Eye } from 'lucide-react';

interface OnboardingForm {
  id: string;
  first_name: string;
  last_name: string;
  generated_email: string | null;
  personal_email: string | null;
  cell_phone: string | null;
  status: string;
  current_step: number;
  created_at: string;
  teams?: { name: string };
}

interface RecruitsListProps {
  managerId?: string;
  recruiterId?: string;
}

export const RecruitsList: React.FC<RecruitsListProps> = ({ managerId, recruiterId }) => {
  const [recruits, setRecruits] = useState<OnboardingForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecruits();
  }, [managerId, recruiterId]);

  const fetchRecruits = async () => {
    try {
      let query = supabase
        .from('onboarding_forms')
        .select(`
          id,
          first_name,
          last_name,
          generated_email,
          personal_email,
          cell_phone,
          status,
          current_step,
          created_at,
          teams:team_id(name)
        `)
        .order('created_at', { ascending: false });

      if (managerId) {
        query = query.eq('manager_id', managerId);
      } else if (recruiterId) {
        query = query.eq('recruiter_id', recruiterId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recruits:', error);
        return;
      }

      setRecruits(data || []);
    } catch (error) {
      console.error('Error fetching recruits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (currentStep: number) => {
    return Math.round((currentStep / 11) * 100); // Assuming 11 total steps
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading recruits...</p>
      </div>
    );
  }

  if (recruits.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No recruits found</p>
        <p className="text-sm text-gray-400 mt-1">
          {managerId ? 'This manager has no assigned recruits' : 'This recruiter has no recruits'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-400" />
          <span className="font-medium">Total Recruits: {recruits.length}</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recruit</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recruits.map((recruit) => (
              <TableRow key={recruit.id}>
                <TableCell>
                  <div className="font-medium">
                    {recruit.first_name} {recruit.last_name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {recruit.generated_email && (
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span>{recruit.generated_email}</span>
                      </div>
                    )}
                    {recruit.personal_email && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span>{recruit.personal_email}</span>
                      </div>
                    )}
                    {recruit.cell_phone && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{recruit.cell_phone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {recruit.teams?.name || 'No team assigned'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(recruit.status)}>
                    {recruit.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${getProgressPercentage(recruit.current_step)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {getProgressPercentage(recruit.current_step)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Step {recruit.current_step} of 11
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span>{formatDate(recruit.created_at)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};