import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Award, Clock, HelpCircle, CheckCircle, Video, Mic, Play, Users, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const quizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  instructions: z.string().optional(),
  course_id: z.string().optional(),
  time_limit_minutes: z.number().min(1),
  passing_score: z.number().min(1).max(100),
  max_attempts: z.number().min(1).max(10),
  video_url: z.string().optional(),
  intro_video_url: z.string().optional(),
  requires_recording: z.boolean(),
  recording_instructions: z.string().optional(),
});

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
  video_url?: string | null;
  intro_video_url?: string | null;
  requires_recording?: boolean;
  recording_instructions?: string | null;
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
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      instructions: "",
      course_id: "none",
      time_limit_minutes: 30,
      passing_score: 70,
      max_attempts: 3,
      video_url: "",
      intro_video_url: "",
      requires_recording: false,
      recording_instructions: "",
    },
  });

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

  const onSubmit = async (values: z.infer<typeof quizSchema>) => {
    try {
      // Get admin user data from localStorage - fix the key
      const adminEmail = localStorage.getItem('adminEmail');
      
      const submitData = {
        ...values,
        course_id: values.course_id === "none" ? null : values.course_id || null,
        created_by: null, // Will be set by RLS policies
        is_active: true,
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
      form.reset({
        title: "",
        description: "",
        instructions: "",
        course_id: "none",
        time_limit_minutes: 30,
        passing_score: 70,
        max_attempts: 3,
        video_url: "",
        intro_video_url: "",
        requires_recording: false,
        recording_instructions: "",
      });
      fetchQuizzes();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast({
        title: "Error",
        description: "Failed to save quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    form.reset({
      title: quiz.title,
      description: quiz.description || "",
      instructions: quiz.instructions || "",
      course_id: quiz.course_id || "none",
      time_limit_minutes: quiz.time_limit_minutes,
      passing_score: quiz.passing_score,
      max_attempts: quiz.max_attempts,
      video_url: quiz.video_url || "",
      intro_video_url: quiz.intro_video_url || "",
      requires_recording: quiz.requires_recording || false,
      recording_instructions: quiz.recording_instructions || "",
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

  const openDialog = () => {
    setEditingQuiz(null);
    form.reset({
      title: "",
      description: "",
      instructions: "",
      course_id: "none",
      time_limit_minutes: 30,
      passing_score: 70,
      max_attempts: 3,
      video_url: "",
      intro_video_url: "",
      requires_recording: false,
      recording_instructions: "",
    });
    setActiveTab('basic');
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="rounded-full h-8 w-8 border-b-2 border-primary animate-spin"></div>
        <p className="ml-4 text-muted-foreground">Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Quiz Management</h2>
            <p className="text-sm text-muted-foreground">Create and manage interactive assessments</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Quiz
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</DialogTitle>
              <DialogDescription>
                {editingQuiz ? 'Update quiz settings and multimedia content' : 'Create an interactive quiz with video content and recording options'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="media">Media & Recording</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quiz Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter quiz title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="course_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Associated Course</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select course (optional)" />
                                </SelectTrigger>
                              </FormControl>
                               <SelectContent>
                                 <SelectItem value="none">No Course (Standalone Quiz)</SelectItem>
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
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description of the quiz"
                              rows={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="instructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instructions</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Instructions for students taking the quiz"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="media" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="intro_video_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              Introduction Video URL
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/intro-video.mp4 or YouTube/Vimeo URL"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="video_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              Main Content Video URL
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/quiz-content.mp4 or YouTube/Vimeo URL"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4 p-4 border border-border/30 rounded-xl bg-gradient-card">
                      <FormField
                        control={form.control}
                        name="requires_recording"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background/50">
                            <div className="space-y-0.5">
                              <FormLabel className="flex items-center gap-2">
                                <Mic className="h-4 w-4 text-destructive" />
                                Require Voice/Video Recording
                              </FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Students must submit a recording as part of this quiz
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="recording_instructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recording Instructions</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="e.g., 'Record a 2-minute explanation of the safety procedures covered in this quiz'"
                                rows={3}
                                disabled={!form.watch('requires_recording')}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="time_limit_minutes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Limit (minutes)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="180"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="passing_score"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passing Score (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="100"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 70)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="max_attempts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Attempts</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 3)}
                              />
                            </FormControl>
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
                    {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quizzes Grid */}
      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No quizzes found</h3>
          <p className="text-muted-foreground mb-6">Create your first interactive quiz with video content</p>
          <Button onClick={openDialog} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Quiz
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="bg-gradient-card shadow-soft hover:shadow-glow transition-all duration-300 border-border/20 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <Badge 
                        variant={quiz.is_active ? "default" : "secondary"} 
                        className={quiz.is_active ? "bg-success text-success-foreground" : ""}
                      >
                        {quiz.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground mb-2">{quiz.title}</CardTitle>
                    {quiz.courses && (
                      <p className="text-sm text-primary font-medium mb-2">
                        Course: {quiz.courses.title}
                      </p>
                    )}
                    <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                      {quiz.description || "No description provided"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{quiz.time_limit_minutes} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-success">{quiz.passing_score}% pass</span>
                  </div>
                </div>
                
                {/* Media Indicators */}
                <div className="flex items-center gap-2 flex-wrap">
                  {quiz.intro_video_url && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 text-blue-700">
                      <Video className="h-3 w-3" />
                      <span className="text-xs font-medium">Intro Video</span>
                    </div>
                  )}
                  {quiz.video_url && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-100 text-purple-700">
                      <Play className="h-3 w-3" />
                      <span className="text-xs font-medium">Content Video</span>
                    </div>
                  )}
                  {quiz.requires_recording && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 text-red-700">
                      <Mic className="h-3 w-3" />
                      <span className="text-xs font-medium">Recording Required</span>
                    </div>
                  )}
                  {!quiz.intro_video_url && !quiz.video_url && !quiz.requires_recording && (
                    <span className="text-xs text-muted-foreground">Text-only quiz</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <HelpCircle className="h-3 w-3" />
                    <span>{quiz.quiz_questions?.length || 0} questions</span>
                  </div>
                  <span>Max {quiz.max_attempts} attempts</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(quiz)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(quiz.id)}
                    disabled={!quiz.is_active}
                    className="flex-1 hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive"
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
  );
};

export default QuizManagement;