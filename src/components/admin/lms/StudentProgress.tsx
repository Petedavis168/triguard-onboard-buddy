import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, User, BookOpen, Award, TrendingUp, Clock, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface StudentProgress {
  user_id: string;
  user_name: string;
  course_title: string;
  course_id: string;
  enrollment_id: string;
  status: string;
  final_score: number | null;
  enrolled_date: string;
  completed_at: string | null;
  lessons_completed: number;
  total_lessons: number;
  quiz_attempts: number;
  last_activity: string | null;
}

interface ProgressStats {
  totalEnrollments: number;
  completedCourses: number;
  inProgressCourses: number;
  averageScore: number;
  overdueCourses: number;
}

const StudentProgress = () => {
  const [progressData, setProgressData] = useState<StudentProgress[]>([]);
  const [filteredData, setFilteredData] = useState<StudentProgress[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalEnrollments: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageScore: 0,
    overdueCourses: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudentProgress();
  }, []);

  useEffect(() => {
    filterData();
  }, [progressData, searchTerm, statusFilter]);

  const fetchStudentProgress = async () => {
    try {
      // Fetch course enrollments with related data
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select(`
          id,
          user_id,
          status,
          final_score,
          enrollment_date,
          completed_at,
          courses!inner(
            id,
            title
          )
        `)
        .order('enrollment_date', { ascending: false });

      if (enrollmentsError) throw enrollmentsError;

      // Fetch lesson completion data
      const { data: lessonCompletions, error: lessonsError } = await supabase
        .from('lesson_completions')
        .select(`
          enrollment_id,
          status,
          updated_at,
          lessons!inner(
            course_id
          )
        `);

      if (lessonsError) throw lessonsError;

      // Fetch quiz attempts data
      const { data: quizAttempts, error: quizError } = await supabase
        .from('quiz_attempts')
        .select(`
          enrollment_id,
          updated_at
        `);

      if (quizError) throw quizError;

      // Fetch total lessons per course
      const { data: courseLessons, error: courseLessonsError } = await supabase
        .from('lessons')
        .select('course_id')
        .eq('is_active', true);

      if (courseLessonsError) throw courseLessonsError;

      // Process the data
      const processedData: StudentProgress[] = (enrollments || []).map(enrollment => {
        const courseId = enrollment.courses.id;
        
        // Count completed lessons for this enrollment
        const enrollmentLessons = lessonCompletions?.filter(lc => 
          lc.enrollment_id === enrollment.id && lc.status === 'completed'
        ) || [];
        
        // Count total lessons for this course
        const totalLessonsForCourse = courseLessons?.filter(cl => cl.course_id === courseId).length || 0;
        
        // Count quiz attempts for this enrollment
        const enrollmentQuizAttempts = quizAttempts?.filter(qa => qa.enrollment_id === enrollment.id).length || 0;
        
        // Find last activity
        const lastLessonActivity = lessonCompletions?.filter(lc => lc.enrollment_id === enrollment.id)
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
        
        const lastQuizActivity = quizAttempts?.filter(qa => qa.enrollment_id === enrollment.id)
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
        
        let lastActivity = null;
        if (lastLessonActivity && lastQuizActivity) {
          lastActivity = new Date(lastLessonActivity.updated_at) > new Date(lastQuizActivity.updated_at) 
            ? lastLessonActivity.updated_at 
            : lastQuizActivity.updated_at;
        } else if (lastLessonActivity) {
          lastActivity = lastLessonActivity.updated_at;
        } else if (lastQuizActivity) {
          lastActivity = lastQuizActivity.updated_at;
        }

        return {
          user_id: enrollment.user_id,
          user_name: `User ${enrollment.user_id.slice(0, 8)}`, // Placeholder - would get from profiles
          course_title: enrollment.courses.title,
          course_id: courseId,
          enrollment_id: enrollment.id,
          status: enrollment.status,
          final_score: enrollment.final_score,
          enrolled_date: enrollment.enrollment_date,
          completed_at: enrollment.completed_at,
          lessons_completed: enrollmentLessons.length,
          total_lessons: totalLessonsForCourse,
          quiz_attempts: enrollmentQuizAttempts,
          last_activity: lastActivity
        };
      });

      setProgressData(processedData);
      calculateStats(processedData);
      
    } catch (error) {
      console.error('Error fetching student progress:', error);
      toast({
        title: "Error",
        description: "Failed to fetch student progress data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data: StudentProgress[]) => {
    const totalEnrollments = data.length;
    const completedCourses = data.filter(d => d.status === 'completed').length;
    const inProgressCourses = data.filter(d => d.status === 'in_progress').length;
    const overdueCourses = data.filter(d => d.status === 'overdue').length;
    
    const scoresWithValues = data.filter(d => d.final_score !== null && d.final_score !== undefined);
    const averageScore = scoresWithValues.length > 0 
      ? Math.round(scoresWithValues.reduce((sum, d) => sum + (d.final_score || 0), 0) / scoresWithValues.length)
      : 0;

    setStats({
      totalEnrollments,
      completedCourses,
      inProgressCourses,
      averageScore,
      overdueCourses,
    });
  };

  const filterData = () => {
    let filtered = progressData;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.course_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredData(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'enrolled': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not started';
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
        <p className="mt-4 text-muted-foreground">Loading progress data...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden p-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{stats.totalEnrollments}</div>
          <div className="text-xs text-gray-600">Total Enrollments</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{stats.completedCourses}</div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm border">
          <div className="text-2xl font-bold text-orange-600">{stats.inProgressCourses}</div>
          <div className="text-xs text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">{stats.averageScore}%</div>
          <div className="text-xs text-gray-600">Avg Score</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm border">
          <div className="text-2xl font-bold text-red-600">{stats.overdueCourses}</div>
          <div className="text-xs text-gray-600">Overdue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search students or courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="enrolled">Enrolled</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Progress List */}
      <div className="h-full overflow-y-auto">
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No progress data found</p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {filteredData.map((progress) => (
              <Card key={`${progress.enrollment_id}`} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{progress.user_name}</h4>
                        <p className="text-xs text-gray-600">{progress.course_title}</p>
                      </div>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(progress.status)}`}>
                      {progress.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Lessons Progress</span>
                      <span>{progress.lessons_completed}/{progress.total_lessons}</span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(progress.lessons_completed, progress.total_lessons)} 
                      className="h-2"
                    />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="font-medium text-gray-900">
                        {progress.final_score ? `${progress.final_score}%` : 'N/A'}
                      </div>
                      <div className="text-gray-600">Final Score</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="font-medium text-gray-900">{progress.quiz_attempts}</div>
                      <div className="text-gray-600">Quiz Attempts</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="font-medium text-gray-900">{formatDate(progress.enrolled_date)}</div>
                      <div className="text-gray-600">Enrolled</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="font-medium text-gray-900">{formatDate(progress.last_activity)}</div>
                      <div className="text-gray-600">Last Activity</div>
                    </div>
                  </div>

                  {progress.completed_at && (
                    <div className="mt-3 p-2 bg-green-50 rounded text-xs text-green-800">
                      <strong>Completed:</strong> {formatDate(progress.completed_at)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgress;