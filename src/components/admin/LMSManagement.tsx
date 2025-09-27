import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, Users, Award, TrendingUp, Plus, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import CourseManagement from './lms/CourseManagement';
import QuizManagement from './lms/QuizManagement';
import StudentProgress from './lms/StudentProgress';
import LearningAssignments from './lms/LearningAssignments';

interface LMSStats {
  totalCourses: number;
  activeCourses: number;
  totalQuizzes: number;
  totalEnrollments: number;
  completedCourses: number;
  averageScore: number;
  pendingReviews: number;
}

const LMSManagement = () => {
  const [stats, setStats] = useState<LMSStats>({
    totalCourses: 0,
    activeCourses: 0,
    totalQuizzes: 0,
    totalEnrollments: 0,
    completedCourses: 0,
    averageScore: 0,
    pendingReviews: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLMSStats();
  }, []);

  const fetchLMSStats = async () => {
    try {
      // Fetch courses stats
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, is_active');

      if (coursesError) throw coursesError;

      // Fetch quizzes count
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select('id')
        .eq('is_active', true);

      if (quizzesError) throw quizzesError;

      // Fetch enrollments stats
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select('id, status, final_score');

      if (enrollmentsError) throw enrollmentsError;

      // Fetch pending reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('quiz_attempts')
        .select('id')
        .eq('status', 'needs_review');

      if (reviewsError) throw reviewsError;

      const totalCourses = coursesData?.length || 0;
      const activeCourses = coursesData?.filter(c => c.is_active).length || 0;
      const totalQuizzes = quizzesData?.length || 0;
      const totalEnrollments = enrollmentsData?.length || 0;
      const completedCourses = enrollmentsData?.filter(e => e.status === 'completed').length || 0;
      const pendingReviews = reviewsData?.length || 0;

      // Calculate average score
      const scoresWithValues = enrollmentsData?.filter(e => e.final_score !== null && e.final_score !== undefined) || [];
      const averageScore = scoresWithValues.length > 0 
        ? Math.round(scoresWithValues.reduce((sum, e) => sum + (e.final_score || 0), 0) / scoresWithValues.length)
        : 0;

      setStats({
        totalCourses,
        activeCourses,
        totalQuizzes,
        totalEnrollments,
        completedCourses,
        averageScore,
        pendingReviews
      });
    } catch (error) {
      console.error('Error fetching LMS stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch LMS statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading LMS data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary p-6 space-y-6">
      {/* Modern Header */}
      <div className="bg-gradient-card rounded-2xl shadow-glow p-6 border border-border/20 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Learning Management</h1>
            <p className="text-muted-foreground">Manage courses, quizzes, and training programs</p>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-gradient-card rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.totalCourses}</div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-card rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{stats.activeCourses}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-card rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{stats.totalQuizzes}</div>
                <div className="text-sm text-muted-foreground">Quizzes</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-card rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">{stats.totalEnrollments}</div>
                <div className="text-sm text-muted-foreground">Enrolled</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-card rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{stats.completedCourses}</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-card rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{stats.averageScore}%</div>
                <div className="text-sm text-muted-foreground">Avg Score</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-card rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">{stats.pendingReviews}</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <Card className="bg-gradient-card shadow-glow border-border/20 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">Learning Management System</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage courses, quizzes, assignments, and track student progress
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="courses" className="w-full">
            <div className="px-6 pb-6">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50 rounded-xl p-1">
                <TabsTrigger value="courses" className="rounded-lg font-medium">Courses</TabsTrigger>
                <TabsTrigger value="quizzes" className="rounded-lg font-medium">Quizzes</TabsTrigger>
                <TabsTrigger value="assignments" className="rounded-lg font-medium">Assignments</TabsTrigger>
                <TabsTrigger value="progress" className="rounded-lg font-medium">Progress</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="courses" className="mt-0 px-6 pb-6">
              <CourseManagement />
            </TabsContent>
            
            <TabsContent value="quizzes" className="mt-0 px-6 pb-6">
              <QuizManagement onStatsUpdate={fetchLMSStats} />
            </TabsContent>
            
            <TabsContent value="assignments" className="mt-0 px-6 pb-6">
              <LearningAssignments onStatsUpdate={fetchLMSStats} />
            </TabsContent>
            
            <TabsContent value="progress" className="mt-0 px-6 pb-6">
              <StudentProgress />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMSManagement;