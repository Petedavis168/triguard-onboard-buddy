import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Video, BookOpen, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty_level: string;
  duration_minutes: number;
  is_required: boolean;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  lessons?: {
    id: string;
    title: string;
    lesson_type: string;
    duration_minutes: number;
    is_active: boolean;
  }[];
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  lesson_order: number;
  lesson_type: string;
  content_url: string | null;
  content_text: string | null;
  duration_minutes: number;
  is_required: boolean;
  is_active: boolean;
}

interface CourseManagementProps {
  onStatsUpdate?: () => void;
}

const CourseManagement: React.FC<CourseManagementProps> = ({ onStatsUpdate }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'safety',
    difficulty_level: 'beginner',
    duration_minutes: 60,
    is_required: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          lessons(id, title, lesson_type, duration_minutes, is_active)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const adminData = localStorage.getItem('admin_user');
      const managerId = adminData ? JSON.parse(adminData).id : null;

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(formData)
          .eq('id', editingCourse.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([{ ...formData, created_by: managerId }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        category: 'safety',
        difficulty_level: 'beginner',
        duration_minutes: 60,
        is_required: false,
      });
      fetchCourses();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      category: course.category,
      difficulty_level: course.difficulty_level,
      duration_minutes: course.duration_minutes,
      is_required: course.is_required,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all associated lessons and quizzes.')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_active: false })
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course deactivated successfully",
      });

      fetchCourses();
      onStatsUpdate?.();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety': return 'bg-red-50 border-red-200';
      case 'technical': return 'bg-blue-50 border-blue-200';
      case 'compliance': return 'bg-purple-50 border-purple-200';
      case 'general': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Course Management</h3>
          <p className="text-sm text-muted-foreground">Create and manage training courses</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </DialogTitle>
              <DialogDescription>
                {editingCourse ? 'Update course information' : 'Create a new training course for your team'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter course title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safety">Safety Training</SelectItem>
                      <SelectItem value="technical">Technical Skills</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="general">General Training</SelectItem>
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
                  placeholder="Describe the course content and objectives"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={formData.difficulty_level}
                    onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                    placeholder="60"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Required Course</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="required"
                      checked={formData.is_required}
                      onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="required" className="text-sm">Mark as required</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingCourse(null);
                    setFormData({
                      title: '',
                      description: '',
                      category: 'safety',
                      difficulty_level: 'beginner',
                      duration_minutes: 60,
                      is_required: false,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Course Grid */}
      <div className="h-full overflow-y-auto">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No courses found</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Course
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {courses.map((course) => (
              <Card key={course.id} className={`hover:shadow-lg transition-all duration-200 ${getCategoryColor(course.category)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className={`text-sm font-semibold leading-tight break-all ${
                          course.title.length > 25 ? 'text-xs' : 'text-sm'
                        }`}>
                          {course.title}
                        </CardTitle>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Badge variant={course.is_active ? "default" : "secondary"} className="text-xs">
                        {course.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {course.description && (
                    <p className={`text-gray-700 break-all ${
                      course.description.length > 80 ? 'text-xs' : 'text-sm'
                    }`}>
                      {course.description.length > 100 
                        ? `${course.description.substring(0, 100)}...`
                        : course.description
                      }
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration_minutes} min</span>
                    <Users className="h-3 w-3 ml-2" />
                    <span>{course.lessons?.length || 0} lessons</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge className={`text-xs ${getDifficultyColor(course.difficulty_level)}`}>
                        {course.difficulty_level}
                      </Badge>
                      {course.is_required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(course)}
                      className="flex-1 hover:bg-blue-50 hover:border-blue-200"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(course.id)}
                      disabled={!course.is_active}
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

export default CourseManagement;