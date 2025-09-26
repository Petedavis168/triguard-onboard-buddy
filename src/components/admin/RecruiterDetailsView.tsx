import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Save, 
  Users, 
  Mail, 
  Clock, 
  UserPlus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { RecruitsList } from './RecruitsList';

const recruiterEditSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type RecruiterEditFormData = z.infer<typeof recruiterEditSchema>;

interface Recruiter {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface RecruiterDetailsViewProps {
  recruiter: Recruiter;
  onBack: () => void;
  onUpdate: () => void;
}

export const RecruiterDetailsView: React.FC<RecruiterDetailsViewProps> = ({
  recruiter,
  onBack,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<RecruiterEditFormData>({
    resolver: zodResolver(recruiterEditSchema),
    defaultValues: {
      first_name: recruiter.first_name,
      last_name: recruiter.last_name,
      email: recruiter.email,
    },
  });

  const handleSave = async (data: RecruiterEditFormData) => {
    try {
      const { error } = await supabase
        .from('recruiters')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', recruiter.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recruiter updated successfully"
      });

      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update recruiter",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recruiters
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {recruiter.first_name} {recruiter.last_name}
            </h2>
            <p className="text-muted-foreground">Recruiter Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                form.reset({
                  first_name: recruiter.first_name,
                  last_name: recruiter.last_name,
                  email: recruiter.email,
                });
              }}>
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(handleSave)}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Recruiter
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      {...form.register('first_name')}
                    />
                    {form.formState.errors.first_name && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      {...form.register('last_name')}
                    />
                    {form.formState.errors.last_name && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <UserPlus className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Name:</span>
                  <span>{recruiter.first_name} {recruiter.last_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Email:</span>
                  <span>{recruiter.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Created:</span>
                  <span>{formatDate(recruiter.created_at)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recruitment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role:</span>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  Recruiter
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated:</span>
                <span className="text-sm">{formatDate(recruiter.updated_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recruits Section */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Recruits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecruitsList recruiterId={recruiter.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};