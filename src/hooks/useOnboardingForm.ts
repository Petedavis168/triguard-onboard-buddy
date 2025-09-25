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
        emailToSave = await generateEmail(data.first_name, data.last_name);
        setGeneratedEmail(emailToSave);
      }

      const formData = {
        ...data,
        generated_email: emailToSave,
        current_step: step,
        status: step === 7 ? 'submitted' : 'in_progress',
        submitted_at: step === 7 ? new Date().toISOString() : null,
      };

      if (savedFormId) {
        // Update existing form
        const { error } = await supabase
          .from('onboarding_forms')
          .update(formData)
          .eq('id', savedFormId);

        if (error) {
          throw error;
        }
      } else {
        // Create new form
        const { data: newForm, error } = await supabase
          .from('onboarding_forms')
          .insert(formData)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setSavedFormId(newForm.id);
      }

      toast({
        title: "Progress Saved",
        description: "Your form has been saved successfully.",
      });

      return { success: true, email: emailToSave };
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
    const isValid = await form.trigger();
    if (isValid) {
      const formData = form.getValues();
      const saveResult = await saveFormData(formData, currentStep + 1);
      if (saveResult.success) {
        setCurrentStep(prev => Math.min(prev + 1, 7));
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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