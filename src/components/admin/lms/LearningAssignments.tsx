import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, ClipboardList, Clock, User, BookOpen, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface LearningAssignment {
  id: string;
  assignment_type: string;
  assigned_to: string;
  assigned_by: string;
  due_date: string | null;
  priority: string;
  status: string;
  completion_notes: string | null;
  created_at: string;
  courses?: {
    title: string;
  };
  quizzes?: {
    title: string;
  };
  managers?: {
    first_name: string;
    last_name: string;
  };
}

interface Course {
  id: string;
  title: string;
}

interface Quiz {
  id: string;
  title: string;
}

interface Manager {
  id: string;
  first_name: string;
  last_name: string;
}

interface LearningAssignmentsProps {
  onStatsUpdate?: () => void;
}

const LearningAssignments: React.FC<LearningAssignmentsProps> = ({ onStatsUpdate }) => {
  const [assignments, setAssignments] = useState<LearningAssignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<LearningAssignment | null>(null);
  const [formData, setFormData] = useState({
    assignment_type: 'course',
    course_id: '',
    quiz_id: '',
    assigned_to: '',
    due_date: '',
    priority: 'medium',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAssignments();
    fetchCourses();
    fetchQuizzes();
    fetchManagers();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_assignments')
        .select(`
          *,
          courses(title),
          quizzes(title),
          managers!learning_assignments_assigned_by_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch learning assignments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .eq('is_active', true)
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, title')
        .eq('is_active', true)
        .order('title');

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const adminData = localStorage.getItem('admin_user');
      const managerId = adminData ? JSON.parse(adminData).id : null;

      const submitData = {
        assignment_type: formData.assignment_type,
        course_id: formData.assignment_type === 'course' ? formData.course_id : null,
        quiz_id: formData.assignment_type === 'quiz' ? formData.quiz_id : null,
        assigned_to: formData.assigned_to,
        assigned_by: managerId,
        due_date: formData.due_date || null,
        priority: formData.priority,
      };

      if (editingAssignment) {
        const { error } = await supabase
          .from('learning_assignments')
          .update(submitData)
          .eq('id', editingAssignment.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Assignment updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('learning_assignments')
          .insert([submitData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Assignment created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingAssignment(null);
      setFormData({
        assignment_type: 'course',
        course_id: '',
        quiz_id: '',
        assigned_to: '',
        due_date: '',
        priority: 'medium',
      });
      fetchAssignments();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast({
        title: "Error",
        description: "Failed to save assignment",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (assignment: LearningAssignment) => {
    setEditingAssignment(assignment);
    setFormData({
      assignment_type: assignment.assignment_type,
      course_id: assignment.courses ? 'course_id_here' : '', // Would need to get actual ID
      quiz_id: assignment.quizzes ? 'quiz_id_here' : '', // Would need to get actual ID
      assigned_to: assignment.assigned_to,
      due_date: assignment.due_date ? assignment.due_date.split('T')[0] : '',
      priority: assignment.priority,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const { error } = await supabase
        .from('learning_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assignment deleted successfully",
      });

      fetchAssignments();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast({
        title: "Error",
        description: "Failed to delete assignment",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'needs_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Learning Assignments</h3>
          <p className="text-sm text-muted-foreground">Assign courses and quizzes to team members</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
              </DialogTitle>
              <DialogDescription>
                {editingAssignment ? 'Update assignment details' : 'Assign learning content to team members'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assignment_type">Assignment Type</Label>
                <Select
                  value={formData.assignment_type}
                  onValueChange={(value) => setFormData({ ...formData, assignment_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.assignment_type === 'course' && (
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Select
                    value={formData.course_id}
                    onValueChange={(value) => setFormData({ ...formData, course_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.assignment_type === 'quiz' && (
                <div className="space-y-2">
                  <Label htmlFor="quiz">Quiz</Label>
                  <Select
                    value={formData.quiz_id}
                    onValueChange={(value) => setFormData({ ...formData, quiz_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quiz" />
                    </SelectTrigger>
                    <SelectContent>
                      {quizzes.map((quiz) => (
                        <SelectItem key={quiz.id} value={quiz.id}>
                          {quiz.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="assigned_to">Assign To (User ID)</Label>
                <Input
                  id="assigned_to"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  placeholder="Enter user ID"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingAssignment(null);
                    setFormData({
                      assignment_type: 'course',
                      course_id: '',
                      quiz_id: '',
                      assigned_to: '',
                      due_date: '',
                      priority: 'medium',
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assignments Grid */}
      <div className="h-full overflow-y-auto">
        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No assignments found</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Assignment
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-lg transition-all duration-200 border border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        {assignment.assignment_type === 'course' ? (
                          <BookOpen className="h-4 w-4 text-white" />
                        ) : (
                          <Award className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm font-semibold leading-tight">
                          {assignment.assignment_type === 'course' 
                            ? assignment.courses?.title 
                            : assignment.quizzes?.title
                          }
                        </CardTitle>
                        <p className="text-xs text-orange-600 mt-1 capitalize">
                          {assignment.assignment_type}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 ml-2">
                      <Badge className={`text-xs ${getStatusColor(assignment.status)}`}>
                        {assignment.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Assignment Details</span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>Assigned to: {assignment.assigned_to.slice(0, 8)}...</div>
                      <div>Assigned by: {assignment.managers?.first_name} {assignment.managers?.last_name}</div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due: {formatDate(assignment.due_date)}
                      </div>
                    </div>
                  </div>
                  
                  {assignment.completion_notes && (
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="text-xs font-medium text-blue-900 mb-1">Notes:</div>
                      <div className="text-xs text-blue-700">
                        {assignment.completion_notes.length > 80 
                          ? `${assignment.completion_notes.substring(0, 80)}...`
                          : assignment.completion_notes
                        }
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(assignment)}
                      className="flex-1 hover:bg-orange-50 hover:border-orange-200"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(assignment.id)}
                      className="flex-1 hover:bg-red-50 hover:border-red-200"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningAssignments;