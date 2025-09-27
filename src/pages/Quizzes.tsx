import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  Play, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Trophy,
  Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Quiz {
  id: string;
  title: string;
  description: string;
  time_limit_minutes: number;
  passing_score: number;
  max_attempts: number;
  attempts_used: number;
  best_score?: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  category: string;
  difficulty: string;
}

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      // Mock data for demonstration
      const mockQuizzes: Quiz[] = [
        {
          id: '1',
          title: 'Roofing Techniques Quiz',
          description: 'Test your knowledge of basic roofing techniques and procedures',
          time_limit_minutes: 30,
          passing_score: 80,
          max_attempts: 3,
          attempts_used: 0,
          status: 'not_started',
          category: 'Technical',
          difficulty: 'intermediate'
        },
        {
          id: '2',
          title: 'Safety Protocols Assessment',
          description: 'Evaluate your understanding of safety protocols and procedures',
          time_limit_minutes: 25,
          passing_score: 85,
          max_attempts: 2,
          attempts_used: 1,
          best_score: 78,
          status: 'failed',
          category: 'Safety',
          difficulty: 'beginner'
        },
        {
          id: '3',
          title: 'Equipment Knowledge Test',
          description: 'Assessment of equipment usage and maintenance knowledge',
          time_limit_minutes: 35,
          passing_score: 75,
          max_attempts: 3,
          attempts_used: 2,
          best_score: 88,
          status: 'completed',
          category: 'Technical',
          difficulty: 'advanced'
        },
        {
          id: '4',
          title: 'Customer Service Quiz',
          description: 'Test your customer service skills and knowledge',
          time_limit_minutes: 20,
          passing_score: 80,
          max_attempts: 3,
          attempts_used: 1,
          best_score: 92,
          status: 'completed',
          category: 'Soft Skills',
          difficulty: 'beginner'
        }
      ];

      setQuizzes(mockQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast({
        title: "Error",
        description: "Failed to load quizzes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'not_started': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'in_progress': return <Play className="h-4 w-4 text-blue-600" />;
      case 'not_started': return <FileText className="h-4 w-4 text-gray-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleStartQuiz = (quiz: Quiz) => {
    if (quiz.attempts_used >= quiz.max_attempts && quiz.status !== 'completed') {
      toast({
        title: "Maximum Attempts Reached",
        description: "You have used all available attempts for this quiz",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Starting Quiz",
      description: `Loading ${quiz.title}...`,
    });

    // Simulate quiz loading
    setTimeout(() => {
      toast({
        title: "Quiz Ready",
        description: `Good luck with "${quiz.title}"!`,
      });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading quizzes...</p>
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
            <div className="flex items-center gap-4">
              <Link to="/user-dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Available Quizzes</h1>
                <p className="text-muted-foreground mt-1">Test your knowledge and skills</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-4 py-2">
                <FileText className="h-4 w-4 mr-2" />
                {quizzes.length} Quizzes
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-blue-700">{quizzes.length}</p>
                  <p className="text-sm text-blue-600">Total Quizzes</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-green-700">
                    {quizzes.filter(q => q.status === 'completed').length}
                  </p>
                  <p className="text-sm text-green-600">Completed</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-yellow-700">
                    {Math.round(quizzes.filter(q => q.best_score).reduce((avg, q) => avg + (q.best_score || 0), 0) / quizzes.filter(q => q.best_score).length) || 0}%
                  </p>
                  <p className="text-sm text-yellow-600">Avg Score</p>
                </div>
                <Target className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-purple-700">
                    {quizzes.filter(q => q.status === 'completed' && (q.best_score || 0) >= q.passing_score).length}
                  </p>
                  <p className="text-sm text-purple-600">Passed</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 flex items-center gap-2">
                      {getStatusIcon(quiz.status)}
                      {quiz.title}
                    </CardTitle>
                    <CardDescription className="text-sm mb-3">
                      {quiz.description}
                    </CardDescription>
                    <div className="flex gap-2">
                      <Badge className={`text-xs ${getStatusColor(quiz.status)}`}>
                        {quiz.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {quiz.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{quiz.time_limit_minutes} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>{quiz.passing_score}% to pass</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Attempts: {quiz.attempts_used}/{quiz.max_attempts}
                  </div>
                  {quiz.best_score && (
                    <div className="text-sm">
                      Best Score: <span className="font-medium">{quiz.best_score}%</span>
                    </div>
                  )}
                </div>

                {quiz.best_score && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Best Score</span>
                      <span>{quiz.best_score}%</span>
                    </div>
                    <Progress 
                      value={quiz.best_score} 
                      className={`h-2 ${quiz.best_score >= quiz.passing_score ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`} 
                    />
                  </div>
                )}

                <Button 
                  className="w-full" 
                  onClick={() => handleStartQuiz(quiz)}
                  disabled={quiz.attempts_used >= quiz.max_attempts && quiz.status !== 'completed'}
                  variant={quiz.status === 'completed' ? 'outline' : 'default'}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {quiz.status === 'completed' ? 'Retake Quiz' : 
                   quiz.status === 'failed' ? 'Retry Quiz' : 
                   quiz.status === 'in_progress' ? 'Continue Quiz' : 'Start Quiz'}
                </Button>

                {quiz.attempts_used >= quiz.max_attempts && quiz.status !== 'completed' && (
                  <p className="text-xs text-red-600 text-center">
                    Maximum attempts reached. Contact your supervisor for assistance.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;