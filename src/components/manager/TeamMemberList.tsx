import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Eye, Mail, Calendar, Mic } from 'lucide-react';
import SubmissionDetailsDialog from '@/components/admin/SubmissionDetailsDialog';
import { useManagerActivity } from '@/hooks/useManagerActivity';

interface TeamMemberListProps {
  teamMembers: any[];
  onRefresh: () => void;
}

const TeamMemberList: React.FC<TeamMemberListProps> = ({ teamMembers, onRefresh }) => {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { updateActivity } = useManagerActivity();

  const handleViewDetails = (member: any) => {
    updateActivity(); // Track activity when viewing member details
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMember(null);
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'submitted':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Team Members</h3>
          <p className="text-muted-foreground">
            Monitor your team's onboarding progress and submissions
          </p>
        </div>
        <Button onClick={onRefresh} variant="outline">
          Refresh
        </Button>
      </div>

      {teamMembers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Team Members Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Team members will appear here once they start the onboarding process and are assigned to you as their manager.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Overview ({teamMembers.length} members)
            </CardTitle>
            <CardDescription>
              Track onboarding progress and review submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Voice Pitch</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="font-medium">
                          {member.first_name} {member.last_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{member.generated_email || 'Not generated'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(member.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-sm">
                            Step {member.current_step || 1} of 9
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${((member.current_step || 1) / 9) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {member.voice_recording_url ? (
                          <div className="flex items-center gap-2">
                            <Mic className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Recorded</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Mic className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Pending</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{formatDate(member.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{formatDate(member.submitted_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleViewDetails(member)}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-2"
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
          </CardContent>
        </Card>
      )}

      {/* Submission Details Dialog */}
      <SubmissionDetailsDialog
        submission={selectedMember}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onUpdate={onRefresh}
      />
    </div>
  );
};

export default TeamMemberList;