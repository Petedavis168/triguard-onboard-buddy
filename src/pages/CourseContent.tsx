import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  BookOpen,
  Award 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CourseModule {
  id: string;
  title: string;
  content: string;
  duration_minutes: number;
  completed: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  difficulty_level: string;
  category: string;
  is_required: boolean;
  modules: CourseModule[];
}

const CourseContent = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourseContent();
  }, [courseId]);

  const fetchCourseContent = () => {
    // Mock course data - in real app this would come from API
    const mockCourse: Course = {
      id: courseId || '1',
      title: 'Safety Training Module 3',
      description: 'Advanced safety procedures and protocols for roofing professionals',
      duration_minutes: 45,
      difficulty_level: 'intermediate',
      category: 'safety',
      is_required: true,
      modules: [
        {
          id: '1',
          title: 'Introduction to Advanced Safety',
          content: 'Welcome to Safety Training Module 3. This module covers advanced safety procedures including fall protection, equipment inspection, and emergency protocols.',
          duration_minutes: 10,
          completed: false
        },
        {
          id: '2',
          title: 'Fall Protection Systems',
          content: 'Learn about different types of fall protection systems, proper installation, and maintenance procedures.',
          duration_minutes: 15,
          completed: false
        },
        {
          id: '3',
          title: 'Equipment Safety Inspection',
          content: 'Detailed procedures for inspecting safety equipment before each use, identifying wear patterns, and replacement criteria.',
          duration_minutes: 12,
          completed: false
        },
        {
          id: '4',
          title: 'Emergency Procedures',
          content: 'Step-by-step emergency response procedures for common roofing accidents and incidents.',
          duration_minutes: 8,
          completed: false
        }
      ]
    };
    setCourse(mockCourse);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate progress when playing
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            handleModuleComplete();
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  const handleModuleComplete = () => {
    if (!course) return;
    
    const updatedCourse = { ...course };
    updatedCourse.modules[currentModule].completed = true;
    setCourse(updatedCourse);
    
    toast({
      title: "Module Complete!",
      description: `You've completed "${updatedCourse.modules[currentModule].title}"`,
    });

    // Auto-advance to next module
    if (currentModule < course.modules.length - 1) {
      setTimeout(() => {
        setCurrentModule(currentModule + 1);
        setProgress(0);
        setIsPlaying(false);
      }, 2000);
    } else {
      // Course complete
      toast({
        title: "Course Complete!",
        description: "Congratulations! You've completed the entire course.",
      });
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  const currentModuleData = course.modules[currentModule];
  const completedModules = course.modules.filter(m => m.completed).length;
  const courseProgress = Math.round((completedModules / course.modules.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/courses">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${getDifficultyColor(course.difficulty_level)}`}>
                {course.difficulty_level}
              </Badge>
              {course.is_required && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-muted-foreground mb-4">{course.description}</p>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {course.duration_minutes} minutes
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {course.modules.length} modules
            </span>
            <span className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              {completedModules}/{course.modules.length} completed
            </span>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Course Progress</span>
              <span>{courseProgress}%</span>
            </div>
            <Progress value={courseProgress} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentModuleData.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Play className="h-5 w-5 text-blue-600" />
                  )}
                  Module {currentModule + 1}: {currentModuleData.title}
                </CardTitle>
                <CardDescription>{currentModuleData.duration_minutes} minutes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Video Player Placeholder */}
                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-white rounded-full p-4 mb-4 shadow-md">
                      {isPlaying ? (
                        <Pause className="h-8 w-8 text-primary" />
                      ) : (
                        <Play className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Video Content</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Module Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Content Text */}
                <div className="prose max-w-none">
                  <p>{currentModuleData.content}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    onClick={handlePlayPause}
                    size="lg"
                    disabled={currentModuleData.completed}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {currentModuleData.completed ? 'Completed' : 'Play'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Modules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.modules.map((module, index) => (
                  <div
                    key={module.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      index === currentModule 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setCurrentModule(index);
                      setProgress(module.completed ? 100 : 0);
                      setIsPlaying(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {module.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <div className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${
                          index === currentModule ? 'border-primary' : 'border-gray-300'
                        }`} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{module.title}</p>
                        <p className="text-xs text-muted-foreground">{module.duration_minutes} min</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;