import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, Users, Award, TrendingUp, Plus, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { CourseManagement } from './lms/CourseManagement';
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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Compact Stats Overview */}
      <div className="grid grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
        <div className="bg-white rounded-lg p-3 shadow-sm border border-border/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">{stats.totalCourses}</div>
              <div className="text-xs text-muted-foreground">Courses</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm border border-border/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">{stats.activeCourses}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm border border-border/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
              <Award className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600">{stats.totalQuizzes}</div>
              <div className="text-xs text-muted-foreground">Quizzes</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm border border-border/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-orange-600">{stats.totalEnrollments}</div>
              <div className="text-xs text-muted-foreground">Enrolled</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm border border-border/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded bg-teal-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-teal-600" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-teal-600">{stats.completedCourses}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm border border-border/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center">
              <Award className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-indigo-600">{stats.averageScore}%</div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm border border-border/30 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-red-600">{stats.pendingReviews}</div>
              <div className="text-xs text-muted-foreground">Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Card className="flex-1 shadow-md flex flex-col overflow-hidden">
        <CardHeader className="pb-2 px-4 pt-3">
          <div>
            <CardTitle className="text-base font-semibold">Learning Management System</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Manage courses, quizzes, assignments, and track student progress
            </CardDescription>
          </div>
        </CardHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="courses" className="h-full flex flex-col">
            <div className="px-4">
              <TabsList className="grid w-full grid-cols-4 h-8 rounded-md mb-2">
                <TabsTrigger value="courses" className="text-xs py-1">Courses</TabsTrigger>
                <TabsTrigger value="quizzes" className="text-xs py-1">Quizzes</TabsTrigger>
                <TabsTrigger value="assignments" className="text-xs py-1">Assignments</TabsTrigger>
                <TabsTrigger value="progress" className="text-xs py-1">Progress</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="courses" className="h-full mt-0">
                <CourseManagement />
              </TabsContent>
              
              <TabsContent value="quizzes" className="h-full mt-0">
                <QuizManagement onStatsUpdate={fetchLMSStats} />
              </TabsContent>
              
              <TabsContent value="assignments" className="h-full mt-0">
                <LearningAssignments onStatsUpdate={fetchLMSStats} />
              </TabsContent>
              
              <TabsContent value="progress" className="h-full mt-0">
                <StudentProgress />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default LMSManagement;