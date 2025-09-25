import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { UseFormReturn } from 'react-hook-form';

interface Task {
  id: string;
  title: string;
  description: string;
  managers: {
    first_name: string;
    last_name: string;
  };
}

interface TaskAcknowledgmentStepProps {
  form: UseFormReturn<any>;
}

const TaskAcknowledgmentStep: React.FC<TaskAcknowledgmentStepProps> = ({ form }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [acknowledgedTasks, setAcknowledgedTasks] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const managerId = form.watch('manager_id');
  const teamId = form.watch('team_id');

  useEffect(() => {
    const fetchTasks = async () => {
      if (!managerId || !teamId) return;

      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            description,
            managers!tasks_manager_id_fkey (
              first_name,
              last_name
            )
          `)
          .eq('manager_id', managerId)
          .eq('team_id', teamId)
          .eq('is_active', true);

        if (error) {
          throw error;
        }

        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: "Error Loading Tasks",
          description: "Failed to load your assigned tasks",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [managerId, teamId, toast]);

  const handleTaskAcknowledgment = (taskId: string, acknowledged: boolean) => {
    const newAcknowledged = new Set(acknowledgedTasks);
    if (acknowledged) {
      newAcknowledged.add(taskId);
    } else {
      newAcknowledged.delete(taskId);
    }
    setAcknowledgedTasks(newAcknowledged);
  };

  const saveTaskAcknowledgments = async () => {
    const formId = form.getValues('id');
    if (!formId || acknowledgedTasks.size === 0) return;

    setIsSaving(true);

    try {
      const taskAssignments = Array.from(acknowledgedTasks).map(taskId => ({
        task_id: taskId,
        onboarding_form_id: formId,
        acknowledged_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('task_assignments')
        .insert(taskAssignments);

      if (error) {
        throw error;
      }

      toast({
        title: "Tasks Acknowledged",
        description: "Your task acknowledgments have been saved successfully",
      });
    } catch (error) {
      console.error('Error saving task acknowledgments:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save your task acknowledgments",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Loading Tasks...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Task Acknowledgment
        </CardTitle>
        <CardDescription>
          Review and acknowledge the tasks assigned to you by your manager
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {tasks.length === 0 ? (
          <Alert>
            <AlertDescription>
              No tasks have been assigned to you yet. Your manager will create tasks specific to your role and team.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert>
              <AlertDescription>
                Please review the tasks below that have been assigned to you. Check each task to acknowledge that you understand your responsibilities.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={task.id}
                      checked={acknowledgedTasks.has(task.id)}
                      onCheckedChange={(checked) => 
                        handleTaskAcknowledgment(task.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <label 
                        htmlFor={task.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {task.title}
                      </label>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        Assigned by: {task.managers.first_name} {task.managers.last_name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {acknowledgedTasks.size > 0 && (
              <div className="flex justify-center">
                <Button
                  onClick={saveTaskAcknowledgments}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  {isSaving ? 'Saving...' : `Acknowledge ${acknowledgedTasks.size} Task${acknowledgedTasks.size !== 1 ? 's' : ''}`}
                </Button>
              </div>
            )}

            <Alert>
              <AlertDescription>
                <strong>Note:</strong> By acknowledging these tasks, you confirm that you understand your responsibilities and are committed to completing them as part of your role at TriGuard Roofing.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskAcknowledgmentStep;