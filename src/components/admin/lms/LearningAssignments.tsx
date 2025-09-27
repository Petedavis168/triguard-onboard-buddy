import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, ClipboardList, Clock, User, BookOpen, Award, Users, Calendar, Target, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const assignmentSchema = z.object({
  assignment_type: z.enum(['course', 'quiz']),
  course_id: z.string().optional(),
  quiz_id: z.string().optional(),
  assigned_to: z.array(z.string()).min(1, "Must assign to at least one user"),
  due_date: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

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
  course_id?: string | null;
  quiz_id?: string | null;
  courses?: {
    id: string;
    title: string;
  };
  quizzes?: {
    id: string;
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

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface LearningAssignmentsProps {
  onStatsUpdate?: () => void;
}

const LearningAssignments: React.FC<LearningAssignmentsProps> = ({ onStatsUpdate }) => {
  const [assignments, setAssignments] = useState<LearningAssignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<LearningAssignment | null>(null);

  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      assignment_type: 'course',
      course_id: "",
      quiz_id: "",
      assigned_to: [],
      due_date: "",
      priority: 'medium',
    },
  });

  useEffect(() => {
    fetchAssignments();
    fetchCourses();
    fetchQuizzes();
    fetchUsers();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_assignments')
        .select(`
          *,
          courses(id, title),
          quizzes(id, title),
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

  const fetchUsers = async () => {
    try {
      // Fetch from onboarding_forms to get available users
      const { data, error } = await supabase
        .from('onboarding_forms')
        .select('id, first_name, last_name, generated_email')
        .eq('status', 'completed');

      if (error) throw error;
      
      // Transform to User format
      const userData: User[] = (data || []).map(form => ({
        id: form.id,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.generated_email || '',
      }));
      
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof assignmentSchema>) => {
    try {
      const adminData = localStorage.getItem('admin_user');
      const managerId = adminData ? JSON.parse(adminData).id : null;

      // Create assignments for each selected user
      const assignmentPromises = values.assigned_to.map(userId => {
        const submitData = {
          assignment_type: values.assignment_type,
          course_id: values.assignment_type === 'course' ? values.course_id : null,
          quiz_id: values.assignment_type === 'quiz' ? values.quiz_id : null,
          assigned_to: userId,
          assigned_by: managerId,
          due_date: values.due_date || null,
          priority: values.priority,
        };

        return supabase.from('learning_assignments').insert([submitData]);
      });

      const results = await Promise.all(assignmentPromises);
      const errors = results.filter(result => result.error);

      if (errors.length > 0) {
        throw new Error(`Failed to create ${errors.length} assignments`);
      }

      toast({
        title: "Success",
        description: `Created ${values.assigned_to.length} assignment${values.assigned_to.length > 1 ? 's' : ''} successfully`,
      });

      setIsDialogOpen(false);
      form.reset();
      fetchAssignments();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error saving assignments:', error);
      toast({
        title: "Error",
        description: "Failed to save assignments",
        variant: "destructive",
      });
    }
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
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'in_progress': return 'bg-primary/10 text-primary border-primary/20';
      case 'assigned': return 'bg-muted text-muted-foreground border-border';
      case 'overdue': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'needs_review': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-warning/10 text-warning border-warning/20';
      case 'medium': return 'bg-primary/10 text-primary border-primary/20';
      case 'low': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const openDialog = () => {
    setEditingAssignment(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="rounded-full h-8 w-8 border-b-2 border-primary animate-spin"></div>
        <p className="ml-4 text-muted-foreground">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Learning Assignments</h2>
            <p className="text-sm text-muted-foreground">Assign courses and quizzes to team members</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Assignment
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}</DialogTitle>
              <DialogDescription>
                Assign learning content to multiple team members with due dates and priorities
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Content Selection</TabsTrigger>
                    <TabsTrigger value="assignment">Assignment Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="space-y-4 mt-4">
                    <FormField
                      control={form.control}
                      name="assignment_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignment Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select assignment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="course">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" />
                                  Course
                                </div>
                              </SelectItem>
                              <SelectItem value="quiz">
                                <div className="flex items-center gap-2">
                                  <Award className="h-4 w-4" />
                                  Quiz
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('assignment_type') === 'course' && (
                      <FormField
                        control={form.control}
                        name="course_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Course</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {courses.map((course) => (
                                  <SelectItem key={course.id} value={course.id}>
                                    {course.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {form.watch('assignment_type') === 'quiz' && (
                      <FormField
                        control={form.control}
                        name="quiz_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Quiz</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select quiz" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {quizzes.map((quiz) => (
                                  <SelectItem key={quiz.id} value={quiz.id}>
                                    {quiz.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="assignment" className="space-y-4 mt-4">
                    <FormField
                      control={form.control}
                      name="assigned_to"
                      render={() => (
                        <FormItem>
                          <div className="flex items-center justify-between mb-3">
                            <FormLabel>Assign to Users</FormLabel>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => form.setValue('assigned_to', users.map(u => u.id))}
                              >
                                Select All
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => form.setValue('assigned_to', [])}
                              >
                                Clear All
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto border border-border/30 rounded-lg p-4">
                            {users.length === 0 ? (
                              <div className="text-center py-8">
                                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No completed onboarding users found</p>
                                <p className="text-sm text-muted-foreground">Users must complete onboarding to receive assignments</p>
                              </div>
                            ) : (
                              users.map((user) => (
                                <FormField
                                  key={user.id}
                                  control={form.control}
                                  name="assigned_to"
                                  render={({ field }) => {
                                    return (
                                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border border-border/20 rounded-lg hover:bg-muted/30 transition-colors">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(user.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...(field.value || []), user.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== user.id
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <div className="flex items-center gap-3 flex-1">
                                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-primary" />
                                          </div>
                                          <div>
                                            <FormLabel className="text-sm font-medium cursor-pointer">
                                              {user.first_name} {user.last_name}
                                            </FormLabel>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                          </div>
                                        </div>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="due_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Due Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-muted rounded-full"></div>
                                    Low Priority
                                  </div>
                                </SelectItem>
                                <SelectItem value="medium">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    Medium Priority
                                  </div>
                                </SelectItem>
                                <SelectItem value="high">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                                    High Priority
                                  </div>
                                </SelectItem>
                                <SelectItem value="urgent">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                                    Urgent
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end space-x-2 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Assignment{form.watch('assigned_to')?.length > 1 ? 's' : ''}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assignments Grid */}
      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No assignments found</h3>
          <p className="text-muted-foreground mb-6">Start assigning learning content to your team</p>
          <Button onClick={openDialog} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Assignment
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => {
            // Find the assigned user
            const assignedUser = users.find(u => u.id === assignment.assigned_to);
            
            return (
              <Card key={assignment.id} className="bg-gradient-card shadow-soft hover:shadow-glow transition-all duration-300 border-border/20 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          {assignment.assignment_type === 'course' ? (
                            <BookOpen className="h-4 w-4 text-primary" />
                          ) : (
                            <Award className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <Badge className={`text-xs ${getStatusColor(assignment.status)}`}>
                          {assignment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-lg font-semibold text-foreground mb-2">
                        {assignment.assignment_type === 'course' 
                          ? assignment.courses?.title 
                          : assignment.quizzes?.title
                        }
                      </CardTitle>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>
                          {assignedUser ? `${assignedUser.first_name} ${assignedUser.last_name}` : 'Unknown User'}
                        </span>
                      </div>
                    </div>
                    
                    <Badge className={`text-xs ${getPriorityColor(assignment.priority)}`}>
                      {assignment.priority}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Due: {assignment.due_date 
                        ? new Date(assignment.due_date).toLocaleDateString()
                        : 'No due date'
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground capitalize">
                      {assignment.assignment_type} Assignment
                    </span>
                  </div>
                  
                  {assignment.completion_notes && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {assignment.completion_notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(assignment.id)}
                      className="flex-1 hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LearningAssignments;