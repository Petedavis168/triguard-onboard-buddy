import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Book, Edit, Plus, Trash2, Video, Clock, Users, Smartphone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration_minutes: z.number().min(0),
  is_required: z.boolean(),
  is_active: z.boolean(),
  roles: z.array(z.string()).optional(),
  positions: z.array(z.string()).optional(),
});

export function CourseManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "general",
      difficulty_level: "beginner",
      duration_minutes: 0,
      is_required: false,
      is_active: true,
      roles: [],
      positions: [],
    },
  });

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_role_requirements (
            employee_role,
            position_id,
            positions (name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRolesAndPositions = async () => {
    try {
      const { data: positionsData, error: positionsError } = await supabase
        .from('positions')
        .select('*')
        .eq('is_active', true);

      if (positionsError) throw positionsError;
      setPositions(positionsData || []);

      // Set roles enum values
      setRoles([
        { value: 'ROOF_PRO', label: 'Roof Pro' },
        { value: 'ROOF_HAWK', label: 'Roof Hawk' },
        { value: 'CSR', label: 'Customer Service Representative' },
        { value: 'APPOINTMENT_SETTER', label: 'Appointment Setter' },
        { value: 'MANAGER', label: 'Manager' },
        { value: 'REGIONAL_MANAGER', label: 'Regional Manager' },
        { value: 'ROOFER', label: 'Roofer' },
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch roles and positions",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchRolesAndPositions();
  }, []);

  const onSubmit = async (values: z.infer<typeof courseSchema>) => {
    try {
      const { roles, positions, ...courseData } = values;
      
      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);

        if (error) throw error;

        // Delete existing role requirements
        await supabase
          .from('course_role_requirements')
          .delete()
          .eq('course_id', editingCourse.id);

        // Insert new role requirements
        if (roles && roles.length > 0) {
          const roleRequirements = roles.map(role => ({
            course_id: editingCourse.id,
            employee_role: role as any,
            is_required: courseData.is_required
          }));
          await supabase.from('course_role_requirements').insert(roleRequirements);
        }

        if (positions && positions.length > 0) {
          const positionRequirements = positions.map(positionId => ({
            course_id: editingCourse.id,
            position_id: positionId,
            is_required: courseData.is_required
          }));
          await supabase.from('course_role_requirements').insert(positionRequirements);
        }
      } else {
        const { data: courseData2, error } = await supabase
          .from('courses')
          .insert([courseData])
          .select()
          .single();

        if (error) throw error;

        // Insert role requirements for new course
        if (roles && roles.length > 0) {
          const roleRequirements = roles.map(role => ({
            course_id: courseData2.id,
            employee_role: role as any,
            is_required: courseData.is_required
          }));
          await supabase.from('course_role_requirements').insert(roleRequirements);
        }

        if (positions && positions.length > 0) {
          const positionRequirements = positions.map(positionId => ({
            course_id: courseData2.id,
            position_id: positionId,
            is_required: courseData.is_required
          }));
          await supabase.from('course_role_requirements').insert(positionRequirements);
        }
      }

      toast({
        title: "Success",
        description: `Course ${editingCourse ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingCourse(null);
      form.reset();
      fetchCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingCourse ? 'update' : 'create'} course`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    const courseRoles = course.course_role_requirements
      ?.filter((req: any) => req.employee_role)
      .map((req: any) => req.employee_role) || [];
    const coursePositions = course.course_role_requirements
      ?.filter((req: any) => req.position_id)
      .map((req: any) => req.position_id) || [];

    form.reset({
      title: course.title,
      description: course.description || "",
      category: course.category,
      difficulty_level: course.difficulty_level,
      duration_minutes: course.duration_minutes,
      is_required: course.is_required,
      is_active: course.is_active,
      roles: courseRoles,
      positions: coursePositions,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course deleted successfully",
      });

      fetchCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-48">Loading courses...</div>;
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold">Course Management</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => { setEditingCourse(null); form.reset(); }}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit' : 'Create'} Course</DialogTitle>
              <DialogDescription>
                {editingCourse ? 'Update course information and role assignments' : 'Create a new course with role-based assignments'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Course title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="safety">Safety Training</SelectItem>
                            <SelectItem value="technical">Technical Skills</SelectItem>
                            <SelectItem value="compliance">Compliance</SelectItem>
                            <SelectItem value="general">General Training</SelectItem>
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
                          placeholder="Course description..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="difficulty_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration_minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Role Assignment */}
                <FormField
                  control={form.control}
                  name="roles"
                  render={() => (
                    <FormItem>
                      <FormLabel>Assign to Employee Roles</FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {roles.map((role) => (
                          <FormField
                            key={role.value}
                            control={form.control}
                            name="roles"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={role.value}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(role.value)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, role.value])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== role.value
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {role.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Position Assignment */}
                <FormField
                  control={form.control}
                  name="positions"
                  render={() => (
                    <FormItem>
                      <FormLabel>Assign to Specific Positions</FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {positions.map((position) => (
                          <FormField
                            key={position.id}
                            control={form.control}
                            name="positions"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={position.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(position.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, position.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== position.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {position.name}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="is_required"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Required Course</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Mark as mandatory
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
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Active</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Course is available
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
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCourse ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {course.description || "No description"}
                  </CardDescription>
                </div>
                <Badge variant={course.is_active ? "default" : "secondary"}>
                  {course.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration_minutes} min</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Level:</span>
                  <Badge variant="outline" className="text-xs">
                    {course.difficulty_level}
                  </Badge>
                </div>
                
                {course.course_role_requirements && course.course_role_requirements.length > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Assigned to:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {course.course_role_requirements.map((req: any, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {req.employee_role ? req.employee_role.replace('_', ' ') : req.positions?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {course.is_required && (
                  <Badge variant="destructive" className="text-xs">Required</Badge>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(course)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(course.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first course to start building your learning management system.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}