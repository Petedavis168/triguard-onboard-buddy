import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Award, Clock, HelpCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  time_limit_minutes: number;
  passing_score: number;
  max_attempts: number;
  is_active: boolean;
  created_at: string;
  course_id: string | null;
  courses?: {
    title: string;
  };
  quiz_questions?: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: string;
  points: number;
}

interface Course {
  id: string;
  title: string;
}

interface QuizManagementProps {
  onStatsUpdate?: () => void;
}

const QuizManagement: React.FC<QuizManagementProps> = ({ onStatsUpdate }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    course_id: '',
    time_limit_minutes: 30,
    passing_score: 70,
    max_attempts: 3,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchQuizzes();
    fetchCourses();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          courses(title),
          quiz_questions(id, question_text, question_type, points)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch quizzes",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const adminData = localStorage.getItem('admin_user');
      const managerId = adminData ? JSON.parse(adminData).id : null;

      const submitData = {
        ...formData,
        course_id: formData.course_id || null,
        created_by: managerId
      };

      if (editingQuiz) {
        const { error } = await supabase
          .from('quizzes')
          .update(submitData)
          .eq('id', editingQuiz.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Quiz updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('quizzes')
          .insert([submitData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Quiz created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingQuiz(null);
      setFormData({
        title: '',
        description: '',
        instructions: '',
        course_id: '',
        time_limit_minutes: 30,
        passing_score: 70,
        max_attempts: 3,
      });
      fetchQuizzes();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast({
        title: "Error",
        description: "Failed to save quiz",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description || '',
      instructions: quiz.instructions || '',
      course_id: quiz.course_id || '',
      time_limit_minutes: quiz.time_limit_minutes,
      passing_score: quiz.passing_score,
      max_attempts: quiz.max_attempts,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz? This will also delete all associated questions and attempts.')) return;

    try {
      const { error } = await supabase
        .from('quizzes')
        .update({ is_active: false })
        .eq('id', quizId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quiz deactivated successfully",
      });

      fetchQuizzes();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to delete quiz",
        variant: "destructive",
      });
    }
  };

  const getPassingScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Quiz Management</h3>
          <p className="text-sm text-muted-foreground">Create and manage assessments and quizzes</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
              </DialogTitle>
              <DialogDescription>
                {editingQuiz ? 'Update quiz settings and information' : 'Create a new quiz or assessment for your courses'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter quiz title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="course">Associated Course</Label>
                  <Select
                    value={formData.course_id}
                    onValueChange={(value) => setFormData({ ...formData, course_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Course (Standalone Quiz)</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the quiz"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Instructions for students taking the quiz"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                  <Input
                    id="time_limit"
                    type="number"
                    min="1"
                    max="180"
                    value={formData.time_limit_minutes}
                    onChange={(e) => setFormData({ ...formData, time_limit_minutes: parseInt(e.target.value) || 30 })}
                    placeholder="30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passing_score">Passing Score (%)</Label>
                  <Input
                    id="passing_score"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.passing_score}
                    onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) || 70 })}
                    placeholder="70"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max_attempts">Max Attempts</Label>
                  <Input
                    id="max_attempts"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.max_attempts}
                    onChange={(e) => setFormData({ ...formData, max_attempts: parseInt(e.target.value) || 3 })}
                    placeholder="3"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingQuiz(null);
                    setFormData({
                      title: '',
                      description: '',
                      instructions: '',
                      course_id: '',
                      time_limit_minutes: 30,
                      passing_score: 70,
                      max_attempts: 3,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quiz Grid */}
      <div className="h-full overflow-y-auto">
        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No quizzes found</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Quiz
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-all duration-200 border border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className={`text-sm font-semibold leading-tight break-all ${
                          quiz.title.length > 25 ? 'text-xs' : 'text-sm'
                        }`}>
                          {quiz.title}
                        </CardTitle>
                        {quiz.courses && (
                          <p className="text-xs text-purple-600 mt-1">
                            {quiz.courses.title}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Badge variant={quiz.is_active ? "default" : "secondary"} className="text-xs">
                        {quiz.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {quiz.description && (
                    <p className={`text-gray-700 break-all ${
                      quiz.description.length > 80 ? 'text-xs' : 'text-sm'
                    }`}>
                      {quiz.description.length > 100 
                        ? `${quiz.description.substring(0, 100)}...`
                        : quiz.description
                      }
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-lg p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                        <Clock className="h-3 w-3" />
                        <span>Time Limit</span>
                      </div>
                      <div className="text-sm font-semibold">{quiz.time_limit_minutes} min</div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Passing</span>
                      </div>
                      <div className={`text-sm font-semibold ${getPassingScoreColor(quiz.passing_score)}`}>
                        {quiz.passing_score}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <HelpCircle className="h-3 w-3" />
                      <span>{quiz.quiz_questions?.length || 0} questions</span>
                    </div>
                    <span>Max {quiz.max_attempts} attempts</span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(quiz)}
                      className="flex-1 hover:bg-purple-50 hover:border-purple-200"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(quiz.id)}
                      disabled={!quiz.is_active}
                      className="flex-1 hover:bg-red-50 hover:border-red-200 disabled:opacity-50"
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

export default QuizManagement;