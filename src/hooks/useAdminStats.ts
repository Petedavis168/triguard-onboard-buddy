import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  onboardingForms: {
    total: number;
    pending: number;
    completed: number;
  };
  managers: {
    total: number;
    active: number;
  };
  teams: {
    total: number;
    departments: number;
  };
  learning: {
    courses: number;
    quizzes: number;
    enrollments: number;
  };
}

export interface RecentActivity {
  id: string;
  type: 'form_submitted' | 'manager_assigned' | 'quiz_completed' | 'course_created';
  title: string;
  description: string;
  timestamp: string;
  color: 'primary' | 'success' | 'warning' | 'blue';
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    onboardingForms: { total: 0, pending: 0, completed: 0 },
    managers: { total: 0, active: 0 },
    teams: { total: 0, departments: 0 },
    learning: { courses: 0, quizzes: 0, enrollments: 0 }
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);

      // Fetch onboarding forms stats
      const { data: formsData } = await supabase
        .from('onboarding_forms')
        .select('status');

      const formStats = {
        total: formsData?.length || 0,
        pending: formsData?.filter(f => f.status === 'submitted' || f.status === 'draft').length || 0,
        completed: formsData?.filter(f => f.status === 'completed').length || 0
      };

      // Fetch managers stats
      const { data: managersData } = await supabase
        .from('managers')
        .select('id, last_activity_at');

      const managerStats = {
        total: managersData?.length || 0,
        active: managersData?.filter(m => {
          if (!m.last_activity_at) return false;
          const lastActivity = new Date(m.last_activity_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return lastActivity > thirtyDaysAgo;
        }).length || 0
      };

      // Fetch teams and departments stats
      const [teamsResponse, departmentsResponse] = await Promise.all([
        supabase.from('teams').select('id'),
        supabase.from('departments').select('id').eq('is_active', true)
      ]);

      const teamStats = {
        total: teamsResponse.data?.length || 0,
        departments: departmentsResponse.data?.length || 0
      };

      // Fetch learning stats
      const [coursesResponse, quizzesResponse, enrollmentsResponse] = await Promise.all([
        supabase.from('courses').select('id').eq('is_active', true),
        supabase.from('quizzes').select('id').eq('is_active', true),
        supabase.from('course_enrollments').select('id')
      ]);

      const learningStats = {
        courses: coursesResponse.data?.length || 0,
        quizzes: quizzesResponse.data?.length || 0,
        enrollments: enrollmentsResponse.data?.length || 0
      };

      setStats({
        onboardingForms: formStats,
        managers: managerStats,
        teams: teamStats,
        learning: learningStats
      });

      // Generate recent activity from real data
      const activities: RecentActivity[] = [];

      // Recent form submissions
      if (formsData && formsData.length > 0) {
        const recentForms = await supabase
          .from('onboarding_forms')
          .select('id, first_name, last_name, updated_at, status')
          .order('updated_at', { ascending: false })
          .limit(3);

        recentForms.data?.forEach(form => {
          if (form.status === 'submitted' || form.status === 'completed') {
            activities.push({
              id: `form-${form.id}`,
              type: 'form_submitted',
              title: 'New onboarding form submitted',
              description: `${form.first_name} ${form.last_name} • ${new Date(form.updated_at).toLocaleString()}`,
              timestamp: form.updated_at,
              color: 'primary'
            });
          }
        });
      }

      // Recent quiz completions
      const recentQuizAttempts = await supabase
        .from('quiz_attempts')
        .select('id, completed_at, quizzes(title)')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(2);

      recentQuizAttempts.data?.forEach(attempt => {
        if (attempt.completed_at) {
          activities.push({
            id: `quiz-${attempt.id}`,
            type: 'quiz_completed',
            title: 'Quiz completed',
            description: `${attempt.quizzes?.title || 'Unknown Quiz'} • ${new Date(attempt.completed_at).toLocaleString()}`,
            timestamp: attempt.completed_at,
            color: 'warning'
          });
        }
      });

      // Recent course creations
      const recentCourses = await supabase
        .from('courses')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(2);

      recentCourses.data?.forEach(course => {
        activities.push({
          id: `course-${course.id}`,
          type: 'course_created',
          title: 'New course created',
          description: `${course.title} • ${new Date(course.created_at).toLocaleString()}`,
          timestamp: course.created_at,
          color: 'blue'
        });
      });

      // Sort activities by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 4));

    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    recentActivity,
    isLoading,
    refetch: fetchStats
  };
};