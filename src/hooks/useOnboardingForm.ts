import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingFormData, GenderType, SizeType, ShoeSizeType } from '@/types/onboarding';
import { toast } from '@/hooks/use-toast';

const onboardingSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  street_address: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip_code: z.string().min(5, 'Valid zip code is required'),
  same_as_mailing: z.boolean(),
  shipping_street_address: z.string().optional(),
  shipping_city: z.string().optional(),
  shipping_state: z.string().optional(),
  shipping_zip_code: z.string().optional(),
  gender: z.enum(['male', 'female']),
  shirt_size: z.enum(['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl']),
  coat_size: z.enum(['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl']),
  pant_size: z.enum(['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl']),
  shoe_size: z.enum(['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5', '14', '14.5', '15']),
  hat_size: z.enum(['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl']),
  team_id: z.string().min(1, 'Please select a team'),
  manager_id: z.string().min(1, 'Please select a manager'),
  recruiter_id: z.string().min(1, 'Please select a recruiter'),
  w9_completed: z.boolean(),
  voice_recording_url: z.string().optional(),
  voice_recording_completed_at: z.string().optional(),
}).refine((data) => {
  if (!data.same_as_mailing) {
    return data.shipping_street_address && data.shipping_city && data.shipping_state && data.shipping_zip_code;
  }
  return true;
}, {
  message: "Shipping address is required when different from mailing address",
  path: ["shipping_street_address"]
});

export const useOnboardingForm = (formId?: string) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [savedFormId, setSavedFormId] = useState<string | null>(formId || null);

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      street_address: '',
      city: '',
      state: '',
      zip_code: '',
      same_as_mailing: true,
      shipping_street_address: '',
      shipping_city: '',
      shipping_state: '',
      shipping_zip_code: '',
      gender: 'male' as GenderType,
      shirt_size: 'm' as SizeType,
      coat_size: 'm' as SizeType,
      pant_size: 'm' as SizeType,
      shoe_size: '9' as ShoeSizeType,
      hat_size: 'm' as SizeType,
      team_id: '',
      manager_id: '',
      recruiter_id: '',
      w9_completed: false,
    },
  });

  // Load existing form data if formId is provided
  useEffect(() => {
    if (savedFormId) {
      loadFormData(savedFormId);
    }
  }, [savedFormId]);

  const loadFormData = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('onboarding_forms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading form:', error);
        return;
      }

      if (data) {
        form.reset(data);
        setCurrentStep(data.current_step);
        setGeneratedEmail(data.generated_email || '');
      }
    } catch (error) {
      console.error('Error loading form:', error);
    }
  };

  const generateEmail = async (firstName: string, lastName: string) => {
    try {
      const response = await supabase.functions.invoke('generate-email', {
        body: { firstName, lastName }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data.email;
    } catch (error) {
      console.error('Error generating email:', error);
      throw error;
    }
  };

  const saveFormData = async (data: any, step: number) => {
    setIsLoading(true);
    try {
      // Generate email if moving past step 1 and no email exists
      let emailToSave = generatedEmail;
      if (step > 1 && !generatedEmail && data.first_name && data.last_name) {
        try {
          emailToSave = await generateEmail(data.first_name, data.last_name);
          setGeneratedEmail(emailToSave);
        } catch (emailError) {
          console.error('Failed to generate email:', emailError);
          // Continue without email - it can be generated later
        }
      }

      // Only save specific fields based on current step to avoid validation issues
      const updateData: any = {
        current_step: step,
        status: (step >= 7 ? 'submitted' : step > 1 ? 'in_progress' : 'draft') as 'draft' | 'in_progress' | 'completed' | 'submitted',
        updated_at: new Date().toISOString(),
      };

      if (emailToSave) {
        updateData.generated_email = emailToSave;
      }

      if (step >= 7) {
        updateData.submitted_at = new Date().toISOString();
      }

      // Add step-specific fields
      if (step >= 1 && data.first_name && data.last_name) {
        updateData.first_name = data.first_name;
        updateData.last_name = data.last_name;
      }

      if (step >= 2) {
        if (data.street_address) updateData.street_address = data.street_address;
        if (data.city) updateData.city = data.city;
        if (data.state) updateData.state = data.state;
        if (data.zip_code) updateData.zip_code = data.zip_code;
        if (data.same_as_mailing !== undefined) updateData.same_as_mailing = data.same_as_mailing;
        if (data.shipping_street_address) updateData.shipping_street_address = data.shipping_street_address;
        if (data.shipping_city) updateData.shipping_city = data.shipping_city;
        if (data.shipping_state) updateData.shipping_state = data.shipping_state;
        if (data.shipping_zip_code) updateData.shipping_zip_code = data.shipping_zip_code;
      }

      if (step >= 3) {
        if (data.gender) updateData.gender = data.gender;
        if (data.shirt_size) updateData.shirt_size = data.shirt_size;
        if (data.coat_size) updateData.coat_size = data.coat_size;
        if (data.pant_size) updateData.pant_size = data.pant_size;
        if (data.shoe_size) updateData.shoe_size = data.shoe_size;
        if (data.hat_size) updateData.hat_size = data.hat_size;
      }

      if (step >= 4 && data.badge_photo_url) {
        updateData.badge_photo_url = data.badge_photo_url;
      }

      if (step >= 5) {
        if (data.team_id) updateData.team_id = data.team_id;
        if (data.manager_id) updateData.manager_id = data.manager_id;
        if (data.recruiter_id) updateData.recruiter_id = data.recruiter_id;
      }

      if (step >= 6) {
        if (data.w9_completed !== undefined) updateData.w9_completed = data.w9_completed;
        if (data.w9_submitted_at) updateData.w9_submitted_at = data.w9_submitted_at;
      }

      let result;
      if (savedFormId) {
        // Update existing form
        const { data: updatedForm, error } = await supabase
          .from('onboarding_forms')
          .update(updateData)
          .eq('id', savedFormId)
          .select()
          .single();

        if (error) {
          throw error;
        }
        result = updatedForm;
      } else {
        // Create new form - need all required fields
        const insertData = {
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          street_address: data.street_address || '',
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zip_code || '',
          same_as_mailing: data.same_as_mailing ?? true,
          gender: data.gender || 'male',
          shirt_size: data.shirt_size || 'm',
          coat_size: data.coat_size || 'm',
          pant_size: data.pant_size || 'm',
          shoe_size: data.shoe_size || '9',
          hat_size: data.hat_size || 'm',
          team_id: data.team_id || null,
          manager_id: data.manager_id || null,
          recruiter_id: data.recruiter_id || null,
          w9_completed: data.w9_completed || false,
          ...updateData,
        };

        const { data: newForm, error } = await supabase
          .from('onboarding_forms')
          .insert(insertData)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setSavedFormId(newForm.id);
        result = newForm;
      }

      console.log('Form saved successfully:', result);
      return { success: true, email: emailToSave, formId: result.id };
      
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: "Error",
        description: "Failed to save form data. Please try again.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const submitForm = async (data: any) => {
    try {
      // Save final form data
      const saveResult = await saveFormData(data, 7);
      if (!saveResult.success) {
        return { success: false };
      }

      // Get manager email for notification
      const { data: manager, error: managerError } = await supabase
        .from('managers')
        .select('email')
        .eq('id', data.manager_id)
        .single();

      if (managerError) {
        console.error('Error fetching manager:', managerError);
        return { success: false };
      }

      // Send notification emails
      const response = await supabase.functions.invoke('send-onboarding-notification', {
        body: {
          employeeName: `${data.first_name} ${data.last_name}`,
          employeeEmail: saveResult.email,
          managerEmail: manager.email,
          formData: data
        }
      });

      if (response.error) {
        console.error('Error sending notifications:', response.error);
      }

      toast({
        title: "Application Submitted!",
        description: "Your onboarding application has been submitted successfully. You and your manager will receive confirmation emails.",
      });

      return { success: true };
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const nextStep = async () => {
    // Get current step fields for validation
    const stepFields = getStepFields(currentStep);
    const isValid = await form.trigger(stepFields);
    
    if (isValid) {
      const formData = form.getValues();
      const saveResult = await saveFormData(formData, currentStep + 1);
      if (saveResult.success) {
        setCurrentStep(prev => Math.min(prev + 1, 9));
        toast({
          title: "Progress Saved",
          description: `Step ${currentStep} completed. Moving to step ${currentStep + 1}.`,
        });
      }
    } else {
      toast({
        title: "Please Complete Required Fields",
        description: "Fill in all required fields before continuing.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Helper function to get fields for current step validation
  const getStepFields = (step: number): (keyof z.infer<typeof onboardingSchema>)[] => {
    switch (step) {
      case 1:
        return ['first_name', 'last_name'];
      case 2:
        return ['street_address', 'city', 'state', 'zip_code'];
      case 3:
        return ['gender', 'shirt_size', 'coat_size', 'pant_size', 'shoe_size', 'hat_size'];
      case 4:
        return []; // Badge photo is optional
      case 5:
        return ['team_id', 'manager_id', 'recruiter_id'];
      case 6:
        return ['w9_completed'];
      case 7:
        return []; // Voice recording is optional but encouraged
      case 8:
        return []; // Task acknowledgment is optional
      case 9:
        return []; // Review step
      default:
        return [];
    }
  };

  return {
    form,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    saveFormData,
    submitForm,
    isLoading,
    generatedEmail,
    savedFormId,
  };
};