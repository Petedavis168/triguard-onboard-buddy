import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Play, 
  Search, 
  Filter,
  Star,
  CheckCircle,
  ArrowLeft,
  Users,
  Award
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  difficulty_level: string;
  category: string;
  is_required: boolean;
  progress?: number;
  status?: 'not_started' | 'in_progress' | 'completed';
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedCategory]);

  const fetchCourses = async () => {
    try {
      // Mock data for demonstration
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Safety Training Module 3',
          description: 'Advanced safety procedures and protocols for roofing professionals',
          duration_minutes: 45,
          difficulty_level: 'intermediate',
          category: 'safety',
          is_required: true,
          progress: 0,
          status: 'not_started'
        },
        {
          id: '2',
          title: 'Roofing Techniques Fundamentals',
          description: 'Essential roofing techniques and best practices',
          duration_minutes: 60,
          difficulty_level: 'beginner',
          category: 'technical',
          is_required: true,
          progress: 75,
          status: 'in_progress'
        },
        {
          id: '3',
          title: 'Customer Service Excellence',
          description: 'Building relationships and providing exceptional customer service',
          duration_minutes: 30,
          difficulty_level: 'beginner',
          category: 'soft_skills',
          is_required: false,
          progress: 100,
          status: 'completed'
        },
        {
          id: '4',
          title: 'Equipment Maintenance',
          description: 'Proper care and maintenance of roofing equipment',
          duration_minutes: 40,
          difficulty_level: 'intermediate',
          category: 'technical',
          is_required: true,
          progress: 0,
          status: 'not_started'
        },
        {
          id: '5',
          title: 'Quality Control Standards',
          description: 'Understanding and implementing quality control measures',
          duration_minutes: 35,
          difficulty_level: 'advanced',
          category: 'quality',
          is_required: true,
          progress: 25,
          status: 'in_progress'
        }
      ];

      setCourses(mockCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    setFilteredCourses(filtered);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'not_started': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Play className="h-4 w-4 text-blue-600" />;
      case 'not_started': return <BookOpen className="h-4 w-4 text-gray-600" />;
      default: return <BookOpen className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleStartCourse = (course: Course) => {
    toast({
      title: "Starting Course",
      description: `Loading ${course.title}...`,
    });
    
    // Navigate to course content page
    setTimeout(() => {
      navigate(`/courses/${course.id}`);
    }, 500);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'safety', label: 'Safety' },
    { value: 'technical', label: 'Technical' },
    { value: 'soft_skills', label: 'Soft Skills' },
    { value: 'quality', label: 'Quality' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading courses...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Course Catalog</h1>
                <p className="text-muted-foreground mt-1">Explore and enroll in training courses</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-4 py-2">
                <BookOpen className="h-4 w-4 mr-2" />
                {courses.length} Courses
              </Badge>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {course.description}
                    </CardDescription>
                  </div>
                  {course.is_required && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration_minutes} min
                    </span>
                    <Badge className={`text-xs ${getDifficultyColor(course.difficulty_level)}`}>
                      {course.difficulty_level}
                    </Badge>
                  </div>
                  <div className={`flex items-center gap-1 ${getStatusColor(course.status || 'not_started')}`}>
                    {getStatusIcon(course.status || 'not_started')}
                    <span className="text-xs font-medium">
                      {course.status === 'completed' ? 'Completed' : 
                       course.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>
                </div>

                {course.status === 'in_progress' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}

                <Button 
                  className="w-full" 
                  onClick={() => handleStartCourse(course)}
                  variant={course.status === 'completed' ? 'outline' : 'default'}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {course.status === 'completed' ? 'Review Course' : 
                   course.status === 'in_progress' ? 'Continue Course' : 'Start Course'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Courses;