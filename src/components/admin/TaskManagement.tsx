import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Task {
  id: string;
  title: string;
  description: string | null;
  manager_id: string;
  team_id: string;
  assigned_to: string | null;
  is_active: boolean;
  created_at: string;
  managers: {
    first_name: string;
    last_name: string;
  } | null;
  teams: {
    name: string;
  } | null;
  employee_profiles: {
    first_name: string;
    last_name: string;
    employee_id: string;
  } | null;
}

interface Manager {
  id: string;
  first_name: string;
  last_name: string;
}

interface Team {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  position: string | null;
}

const TaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    manager_id: '',
    team_id: '',
    assigned_to: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
    fetchManagers();
    fetchTeams();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          managers!tasks_manager_id_fkey (
            first_name,
            last_name
          ),
          teams!tasks_team_id_fkey (
            name
          ),
          employee_profiles!tasks_assigned_to_fkey (
            first_name,
            last_name,
            employee_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('managers')
        .select('id, first_name, last_name')
        .order('first_name');

      if (error) throw error;
      setManagers(data || []);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_profiles')
        .select('id, first_name, last_name, employee_id, position')
        .eq('is_active', true)
        .order('first_name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTask) {
        const { error } = await supabase
          .from('tasks')
          .update(formData)
          .eq('id', editingTask.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', manager_id: '', team_id: '', assigned_to: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: "Error",
        description: "Failed to save task",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      manager_id: task.manager_id,
      team_id: task.team_id,
      assigned_to: task.assigned_to || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ is_active: false })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task deactivated successfully",
      });

      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Tasks...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Task Management</h2>
          <p className="text-muted-foreground">
            Manage tasks assigned to team members by their managers
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </DialogTitle>
              <DialogDescription>
                Create or modify tasks that will be assigned to team members
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the task in detail"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Select
                  value={formData.manager_id}
                  onValueChange={(value) => setFormData({ ...formData, manager_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.first_name} {manager.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Select
                  value={formData.team_id}
                  onValueChange={(value) => setFormData({ ...formData, team_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assigned_to">Assign to Rep (Optional)</Label>
                <Select
                  value={formData.assigned_to}
                  onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name} ({employee.employee_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                  setIsDialogOpen(false);
                    setEditingTask(null);
                    setFormData({ title: '', description: '', manager_id: '', team_id: '', assigned_to: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>
            Overview of all tasks in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tasks found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-xl border border-border/40 hover:shadow-lg transition-all duration-200 hover:border-blue-200 overflow-hidden">
                  <div className="p-5">
                    {/* Header with Title and Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ${
                          task.is_active ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        }`}>
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className={`font-semibold text-gray-900 leading-tight break-all ${
                            task.title.length > 20 ? 'text-sm' : 'text-base'
                          }`}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Created: {formatDate(task.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <Badge variant={task.is_active ? "default" : "secondary"} className="text-xs">
                          {task.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>

                    {/* Description */}
                    {task.description && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">Task Description</span>
                        </div>
                        <p className={`text-gray-700 break-all ${
                          task.description.length > 80 ? 'text-xs' : 'text-sm'
                        }`}>
                          {task.description}
                        </p>
                      </div>
                    )}

                    {/* Assignment Info */}
                    <div className="space-y-2 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Edit className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Assigned Manager</span>
                        </div>
                        <div className={`text-blue-700 mt-1 break-all ${
                          task.managers ? `${task.managers.first_name} ${task.managers.last_name}`.length > 20 ? 'text-xs' : 'text-sm' : 'text-sm'
                        }`}>
                          {task.managers ? `${task.managers.first_name} ${task.managers.last_name}` : 'Unknown Manager'}
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">Target Team</span>
                        </div>
                        <div className={`text-purple-700 mt-1 break-all ${
                          task.teams ? task.teams.name.length > 20 ? 'text-xs' : 'text-sm' : 'text-sm'
                        }`}>
                          {task.teams ? task.teams.name : 'Unknown Team'}
                        </div>
                      </div>
                      
                      {task.employee_profiles && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">Assigned Rep</span>
                          </div>
                          <div className="text-green-700 mt-1 text-sm">
                            {task.employee_profiles.first_name} {task.employee_profiles.last_name}
                            <span className="text-xs text-green-600 block">
                              {task.employee_profiles.employee_id}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(task)}
                        className="flex-1 hover:bg-blue-50 hover:border-blue-200"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(task.id)}
                        disabled={!task.is_active}
                        className="flex-1 hover:bg-red-50 hover:border-red-200 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskManagement;