import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useManagerActivity } from '@/hooks/useManagerActivity';

interface ManagerTaskCreationProps {
  managerId: string;
  teamId: string;
  onTaskCreated: () => void;
}

const ManagerTaskCreation: React.FC<ManagerTaskCreationProps> = ({
  managerId,
  teamId,
  onTaskCreated
}) => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { updateActivity } = useManagerActivity();

  useEffect(() => {
    fetchTeamMembers();
  }, [managerId]);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_forms')
        .select('id, first_name, last_name, generated_email, status')
        .eq('manager_id', managerId)
        .order('first_name');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    }
  };

  const handleMemberToggle = (memberId: string, checked: boolean) => {
    updateActivity(); // Track activity when selecting members
    const newSelected = new Set(selectedMembers);
    if (checked) {
      newSelected.add(memberId);
    } else {
      newSelected.delete(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(new Set(teamMembers.map(m => m.id)));
    } else {
      setSelectedMembers(new Set());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    if (selectedMembers.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one team member",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create the task
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert([{
          title: formData.title,
          description: formData.description || null,
          manager_id: managerId,
          team_id: teamId,
        }])
        .select()
        .single();

      if (taskError) throw taskError;

      // Create task assignments for selected members
      const assignments = Array.from(selectedMembers).map(memberId => ({
        task_id: taskData.id,
        onboarding_form_id: memberId,
      }));

      const { error: assignmentError } = await supabase
        .from('task_assignments')
        .insert(assignments);

      if (assignmentError) throw assignmentError;

      // Send email notifications to assigned team members
      try {
        const { data: managerData } = await supabase
          .from('managers')
          .select('first_name, last_name')
          .eq('id', managerId)
          .single();

        // Send notification to each assigned member
        for (const memberId of selectedMembers) {
          const member = teamMembers.find(m => m.id === memberId);
          if (member) {
            await supabase.functions.invoke('send-user-notifications', {
              body: {
                type: 'task_assignment',
                user_data: {
                  first_name: member.first_name,
                  last_name: member.last_name,
                  generated_email: member.generated_email,
                  personal_email: member.personal_email,
                },
                task_data: {
                  task_title: formData.title,
                  task_description: formData.description,
                  assigned_by: managerData ? `${managerData.first_name} ${managerData.last_name}` : 'Your Manager',
                }
              }
            });
          }
        }
      } catch (emailError) {
        console.error('Error sending task notification emails:', emailError);
        // Don't block task creation if email fails
      }

      // Update activity after task creation
      updateActivity();

      toast({
        title: "Success",
        description: `Task "${formData.title}" created and assigned to ${selectedMembers.size} team member(s)`,
      });

      // Reset form
      setFormData({ title: '', description: '' });
      setSelectedMembers(new Set());
      onTaskCreated();

    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Create New Task</h3>
        <p className="text-muted-foreground">
          Create tasks that will be assigned to your team members during their onboarding process.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Task Details
            </CardTitle>
            <CardDescription>
              Define the task that your team members need to acknowledge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Safety Training Completion"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide detailed instructions for this task..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Assign to Team Members
            </CardTitle>
            <CardDescription>
              Select which team members should acknowledge this task
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No team members found</p>
                <p className="text-sm text-gray-400">Team members will appear here once they start the onboarding process</p>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2 pb-4 border-b">
                  <Checkbox
                    id="select-all"
                    checked={selectedMembers.size === teamMembers.length && teamMembers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="font-medium">
                    Select All ({teamMembers.length} members)
                  </Label>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={member.id}
                        checked={selectedMembers.has(member.id)}
                        onCheckedChange={(checked) => handleMemberToggle(member.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={member.id} className="cursor-pointer">
                          <div className="font-medium">
                            {member.first_name} {member.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {member.generated_email} • Status: {member.status}
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedMembers.size > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {selectedMembers.size} of {teamMembers.length} members selected
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading || teamMembers.length === 0}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {isLoading ? 'Creating Task...' : 'Create & Assign Task'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManagerTaskCreation;