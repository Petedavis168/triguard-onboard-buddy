import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  FileText, 
  Trophy,
  Target,
  Calendar,
  User,
  GraduationCap,
  ArrowRight,
  Star,
  Award
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ProfileEditDialog from '@/components/user/ProfileEditDialog';

interface UserProgress {
  onboarding_status: 'completed' | 'in_progress' | 'not_started';
  onboarding_progress: number;
  courses_enrolled: number;
  courses_completed: number;
  total_score: number;
  certificates_earned: number;
  next_assignments: Assignment[];
  recent_activity: Activity[];
}

interface Assignment {
  id: string;
  title: string;
  type: 'course' | 'quiz' | 'task';
  due_date: string | null;
  priority: 'high' | 'medium' | 'low';
  estimated_time: number;
}

interface Activity {
  id: string;
  type: 'course_completed' | 'quiz_passed' | 'assignment_submitted';
  title: string;
  date: string;
  score?: number;
}

const UserDashboard = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProgress();
  }, []);

  const fetchUserProgress = async () => {
    try {
      // Simulate user progress data for now
      // In a real app, this would fetch based on auth.uid()
      const mockProgress: UserProgress = {
        onboarding_status: 'in_progress',
        onboarding_progress: 67,
        courses_enrolled: 5,
        courses_completed: 2,
        total_score: 85,
        certificates_earned: 1,
        next_assignments: [
          {
            id: '1',
            title: 'Safety Training Module 3',
            type: 'course',
            due_date: '2025-10-05',
            priority: 'high',
            estimated_time: 45
          },
          {
            id: '2',
            title: 'Roofing Techniques Quiz',
            type: 'quiz',
            due_date: '2025-10-03',
            priority: 'medium',
            estimated_time: 30
          },
          {
            id: '3',
            title: 'Complete Onboarding Documents',
            type: 'task',
            due_date: '2025-09-30',
            priority: 'high',
            estimated_time: 20
          }
        ],
        recent_activity: [
          {
            id: '1',
            type: 'course_completed',
            title: 'Basic Safety Training',
            date: '2025-09-25',
            score: 92
          },
          {
            id: '2',
            type: 'quiz_passed',
            title: 'Equipment Knowledge Test',
            date: '2025-09-23',
            score: 88
          }
        ]
      };

      setUserProgress(mockProgress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      toast({
        title: "Error",
        description: "Failed to load your progress",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-700';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-700';
      case 'low': return 'border-green-200 bg-green-50 text-green-700';
      default: return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'quiz': return <FileText className="h-4 w-4" />;
      case 'task': return <CheckCircle className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleContinueOnboarding = () => {
    // Navigate to onboarding form
    navigate('/onboarding');
  };

  const handleStartAssignment = (assignment: Assignment) => {
    switch (assignment.type) {
      case 'course':
        navigate('/courses');
        break;
      case 'quiz':
        navigate('/quizzes');
        break;
      case 'task':
        if (assignment.title.toLowerCase().includes('onboarding')) {
          navigate('/onboarding');
        } else {
          toast({
            title: "Starting Task",
            description: `Loading ${assignment.title}...`,
          });
        }
        break;
      default:
        break;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'courses':
        navigate('/courses');
        break;
      case 'quiz':
        navigate('/quizzes');
        break;
      case 'certificates':
        navigate('/certificates');
        break;
      case 'profile':
        setIsProfileDialogOpen(true);
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back! 👋</h1>
              <p className="text-muted-foreground mt-1">Continue your learning journey with TriGuard Roofing</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-4 py-2">
                <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                Level 2 Roofer
              </Badge>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" onClick={() => navigate('/courses')}>
                <Play className="h-4 w-4 mr-2" />
                Continue Learning
              </Button>
            </div>
          </div>
        </div>

        {/* Onboarding Alert */}
        {userProgress?.onboarding_status !== 'completed' && (
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-orange-600" />
                <div>
                  <CardTitle className="text-lg text-orange-900">Complete Your Onboarding</CardTitle>
                  <CardDescription className="text-orange-700">
                    Finish setting up your profile to access all learning materials
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-orange-800 font-medium">Progress</span>
                  <span className="text-orange-600">{userProgress?.onboarding_progress}%</span>
                </div>
                <Progress 
                  value={userProgress?.onboarding_progress} 
                  className="bg-orange-200 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-yellow-500"
                />
              </div>
              <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100" onClick={handleContinueOnboarding}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue Onboarding
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-700">{userProgress?.courses_enrolled}</p>
                  <p className="text-sm text-blue-600 font-medium">Courses Enrolled</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-700">{userProgress?.courses_completed}</p>
                  <p className="text-sm text-green-600 font-medium">Courses Completed</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-700">{userProgress?.total_score}</p>
                  <p className="text-sm text-purple-600 font-medium">Average Score</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-700">{userProgress?.certificates_earned}</p>
                  <p className="text-sm text-yellow-600 font-medium">Certificates</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Assignments and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Next Assignments
                </CardTitle>
                <CardDescription>Complete these to stay on track</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProgress?.next_assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getPriorityColor(assignment.priority)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(assignment.type)}
                        <div>
                          <h3 className="font-semibold">{assignment.title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm opacity-75">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {assignment.estimated_time} min
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={assignment.priority === 'high' ? 'destructive' : assignment.priority === 'medium' ? 'default' : 'secondary'}>
                        {assignment.priority}
                      </Badge>
                    </div>
                    <Button size="sm" className="w-full" onClick={() => handleStartAssignment(assignment)}>
                      <Play className="h-4 w-4 mr-2" />
                      Start {assignment.type === 'course' ? 'Course' : assignment.type === 'quiz' ? 'Quiz' : 'Task'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your learning progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProgress?.recent_activity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                        {activity.score && (
                          <Badge variant="outline" className="text-xs">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            {activity.score}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" onClick={() => handleQuickAction('courses')}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => handleQuickAction('quiz')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Take a Quiz
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => handleQuickAction('certificates')}>
                  <Trophy className="h-4 w-4 mr-2" />
                  View Certificates
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => handleQuickAction('profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Course Completion</span>
                    <span>{Math.round((userProgress?.courses_completed || 0) / (userProgress?.courses_enrolled || 1) * 100)}%</span>
                  </div>
                  <Progress value={(userProgress?.courses_completed || 0) / (userProgress?.courses_enrolled || 1) * 100} />
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">This Week's Goals</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Complete Safety Module
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      Take Equipment Quiz
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      Submit Project Photos
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Edit Dialog */}
        <ProfileEditDialog 
          isOpen={isProfileDialogOpen} 
          onClose={() => setIsProfileDialogOpen(false)} 
        />
      </div>
    </div>
  );
};

export default UserDashboard;