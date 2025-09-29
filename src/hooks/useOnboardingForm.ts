import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingFormData, GenderType, SizeType, ShoeSizeType } from '@/types/onboarding';
import { toast } from '@/hooks/use-toast';

// Profanity filter - list of inappropriate words/terms
const inappropriateWords = [
  'damn', 'hell', 'shit', 'fuck', 'bitch', 'ass', 'asshole', 'bastard', 'crap', 'piss',
  'whore', 'slut', 'retard', 'idiot', 'stupid', 'dumb', 'moron', 'loser', 'freak',
  'nazi', 'hitler', 'terrorist', 'kill', 'murder', 'death', 'suicide', 'bomb',
  'drug', 'cocaine', 'heroin', 'meth', 'weed', 'marijuana', 'porn', 'sex', 'nude'
];

const isInappropriate = (text: string): boolean => {
  const lowercaseText = text.toLowerCase().replace(/[^a-z]/g, '');
  return inappropriateWords.some(word => lowercaseText.includes(word));
};

// Phone number formatting helper
const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

const onboardingSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  nickname: z.string()
    .max(30, "Nickname must be less than 30 characters")
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || !isInappropriate(val), {
      message: "Nickname contains inappropriate content. Please choose a different nickname."
    }),
  cell_phone: z.string()
    .min(1, 'Cell phone number is required')
    .transform((val) => val.replace(/\D/g, '')) // Remove all non-digits for validation
    .refine((val) => val.length === 10, "Please enter a valid 10-digit phone number"),
  personal_email: z.string().email('Valid personal email is required'),
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
  social_security_card_url: z.string().optional(),
  drivers_license_url: z.string().optional(),
  bank_routing_number: z.string().optional(),
  bank_account_number: z.string().optional(),
  account_type: z.enum(['checking', 'savings']).optional(),
  direct_deposit_form_url: z.string().optional(),
  direct_deposit_confirmed: z.boolean().optional(),
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
      nickname: '',
      cell_phone: '',
      personal_email: '',
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
      social_security_card_url: '',
      drivers_license_url: '',
      bank_routing_number: '',
      bank_account_number: '',
      account_type: undefined,
      direct_deposit_form_url: '',
      direct_deposit_confirmed: false,
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
        // Type-cast the data to match the form schema
        const formData = {
          ...data,
          account_type: data.account_type as 'checking' | 'savings' | undefined,
        };
        form.reset(formData);
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
        status: (step >= 12 ? 'submitted' : step > 1 ? 'in_progress' : 'draft') as 'draft' | 'in_progress' | 'completed' | 'submitted',
        updated_at: new Date().toISOString(),
      };

      if (emailToSave) {
        updateData.generated_email = emailToSave;
      }

      if (step >= 13) {
        updateData.submitted_at = new Date().toISOString();
      }

      // Add step-specific fields
      if (step >= 1 && data.first_name && data.last_name) {
        updateData.first_name = data.first_name;
        updateData.last_name = data.last_name;
        if (data.nickname) updateData.nickname = data.nickname;
        if (data.cell_phone) updateData.cell_phone = data.cell_phone;
        if (data.personal_email) updateData.personal_email = data.personal_email;
      }

      if (step >= 2) {
        if (data.employee_role) updateData.employee_role = data.employee_role;
      }

      if (step >= 4) {
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

      if (step >= 5) {
        if (data.gender) updateData.gender = data.gender;
        if (data.shirt_size) updateData.shirt_size = data.shirt_size;
        if (data.coat_size) updateData.coat_size = data.coat_size;
        if (data.pant_size) updateData.pant_size = data.pant_size;
        if (data.shoe_size) updateData.shoe_size = data.shoe_size;
        if (data.hat_size) updateData.hat_size = data.hat_size;
      }

      if (step >= 6 && data.badge_photo_url) {
        updateData.badge_photo_url = data.badge_photo_url;
      }

      if (step >= 7) {
        if (data.team_id) updateData.team_id = data.team_id;
        if (data.manager_id) updateData.manager_id = data.manager_id;
        if (data.recruiter_id) updateData.recruiter_id = data.recruiter_id;
      }

      if (step >= 9) {
        if (data.w9_completed !== undefined) updateData.w9_completed = data.w9_completed;
        if (data.w9_submitted_at) updateData.w9_submitted_at = data.w9_submitted_at;
      }

      if (step >= 10) {
        if (data.social_security_card_url) updateData.social_security_card_url = data.social_security_card_url;
        if (data.drivers_license_url) updateData.drivers_license_url = data.drivers_license_url;
        if (data.social_security_card_url && data.drivers_license_url) {
          updateData.documents_uploaded_at = new Date().toISOString();
        }
      }

      if (step >= 11) {
        if (data.bank_routing_number) updateData.bank_routing_number = data.bank_routing_number;
        if (data.bank_account_number) updateData.bank_account_number = data.bank_account_number;
        if (data.account_type) updateData.account_type = data.account_type;
        if (data.direct_deposit_form_url) updateData.direct_deposit_form_url = data.direct_deposit_form_url;
        if (data.direct_deposit_confirmed !== undefined) updateData.direct_deposit_confirmed = data.direct_deposit_confirmed;
        if (data.direct_deposit_confirmed) {
          updateData.direct_deposit_completed_at = new Date().toISOString();
        }
      }

      if (step >= 12) {
        if (data.voice_recording_url) updateData.voice_recording_url = data.voice_recording_url;
        if (data.voice_recording_completed_at) updateData.voice_recording_completed_at = data.voice_recording_completed_at;
      }

      let result;
      if (savedFormId) {
        // Update existing form
        const { data: updatedForm, error } = await supabase
          .from('onboarding_forms')
          .update(updateData)
          .eq('id', savedFormId)
          .select()
          .maybeSingle();

        if (error) {
          console.error('Error updating form:', error);
          throw error;
        }
        
        if (!updatedForm) {
          console.warn('No form found with ID:', savedFormId);
          throw new Error('Form not found for update');
        }
        
        result = updatedForm;
      } else {
        // Create new form - need all required fields
        const insertData = {
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          nickname: data.nickname || null,
          cell_phone: data.cell_phone || '',
          personal_email: data.personal_email || '',
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
          social_security_card_url: data.social_security_card_url || null,
          drivers_license_url: data.drivers_license_url || null,
          bank_routing_number: data.bank_routing_number || null,
          bank_account_number: data.bank_account_number || null,
          account_type: data.account_type || null,
          direct_deposit_form_url: data.direct_deposit_form_url || null,
          direct_deposit_confirmed: data.direct_deposit_confirmed || false,
          // Generate username and password for login
          username: `${(data.first_name || '').toLowerCase()}${(data.last_name || '').toLowerCase()}`,
          user_password: data.cell_phone || '0000000000',
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

      // Send webhook for step completion (skip for initial save)
      if (step > 1) {
        try {
          await supabase.functions.invoke('webhook-integration', {
            body: {
              event_type: 'onboarding.step_completed',
              webhook_url: 'https://your-app.com/webhooks/triguard', // This should be configurable
              data: {
                form_id: result.id,
                step_completed: step,
                employee_data: {
                  name: `${data.first_name || ''} ${data.last_name || ''}`,
                  email: emailToSave || data.personal_email,
                  current_step: step,
                  status: result.status
                }
              }
            }
          });
        } catch (webhookError) {
          console.log('Webhook notification failed (non-critical):', webhookError);
        }
      }

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
      const saveResult = await saveFormData(data, 11);
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

      // Send completion webhook
      try {
        await supabase.functions.invoke('webhook-integration', {
          body: {
            event_type: 'onboarding.completed',
            webhook_url: 'https://your-app.com/webhooks/triguard', // This should be configurable
            data: {
              form_id: saveResult.formId,
              employee_data: {
                name: `${data.first_name} ${data.last_name}`,
                email: saveResult.email,
                generated_email: generatedEmail,
                personal_email: data.personal_email,
                address: {
                  street: data.street_address,
                  city: data.city,
                  state: data.state,
                  zip: data.zip_code
                },
                gear_sizes: {
                  shirt: data.shirt_size,
                  coat: data.coat_size,
                  pants: data.pant_size,
                  shoes: data.shoe_size,
                  hat: data.hat_size
                },
                team_id: data.team_id,
                manager_id: data.manager_id,
                recruiter_id: data.recruiter_id,
                w9_completed: data.w9_completed,
                documents_uploaded: Boolean(data.social_security_card_url && data.drivers_license_url),
                direct_deposit_setup: Boolean(data.direct_deposit_confirmed),
                submitted_at: new Date().toISOString()
              }
            }
          }
        });
        console.log('Completion webhook sent successfully');
      } catch (webhookError) {
        console.log('Webhook notification failed (non-critical):', webhookError);
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
    // Special handling for step 1 -> 2 (email generation)
    if (currentStep === 1) {
      const stepFields = getStepFields(currentStep);
      const isValid = await form.trigger(stepFields);
      
      if (isValid) {
        const formData = form.getValues();
        
        toast({
          title: "Generating your company email...",
          description: `Name: ${formData.first_name} ${formData.last_name}, Phone: ${formData.cell_phone}`,
          duration: 3000,
        });
        
        setIsLoading(true);
        
        try {
          // Generate email first if it doesn't exist
          if (!generatedEmail && formData.first_name && formData.last_name) {
            const email = await generateEmail(formData.first_name, formData.last_name);
            setGeneratedEmail(email);
          }
          
          // Save data and advance to step 2 (email preview)
          const saveResult = await saveFormData(formData, 2);
          if (saveResult.success) {
            setCurrentStep(2);
            toast({
              title: "Email Generated Successfully!",
              description: "Please review and save your credentials before continuing.",
              duration: 3000,
            });
          } else {
            toast({
              title: "Error Saving Data",
              description: "Failed to generate email credentials. Please try again.",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error Generating Email",
            description: "Failed to create your company email. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        toast({
          title: "Please Complete Required Fields",
          description: "Fill in all required fields before continuing.",
          variant: "destructive",
        });
      }
      return;
    }

    // Special handling for step 2 (email preview) - require explicit confirmation
    if (currentStep === 2) {
      if (!generatedEmail) {
        toast({
          title: "Email Not Generated",
          description: "Please wait for your email credentials to be generated.",
          variant: "destructive",
        });
        return;
      }
      
      // Simple confirmation - just advance since the EmailPreviewStep component handles the UI
      setCurrentStep(3);
      toast({
        title: "Moving to Address Information",
        description: "Your credentials have been noted. Proceeding to address step.",
        duration: 2000,
      });
      return;
    }

    // Standard handling for all other steps
    const stepFields = getStepFields(currentStep);
    const isValid = await form.trigger(stepFields);
    
    if (isValid) {
      const formData = form.getValues();
      
      // Show verification toast with entered data
      const stepData = getStepDataSummary(currentStep, formData);
      if (stepData) {
        toast({
          title: "Saving your information...",
          description: stepData,
          duration: 2000,
        });
      }
      
      // Add loading state and delay to let users see their entered data
      setIsLoading(true);
      
      try {
        // Add a delay to show the verification
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const saveResult = await saveFormData(formData, currentStep + 1);
        if (saveResult.success) {
          setCurrentStep(prev => Math.min(prev + 1, 12));
          toast({
            title: "Information Saved Successfully!",
            description: `Step ${currentStep} completed. Moving to step ${currentStep + 1}.`,
            duration: 1500,
          });
        } else {
          toast({
            title: "Error Saving Data",
            description: "Failed to save your progress. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
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
        return ['first_name', 'last_name', 'cell_phone', 'personal_email'];
      case 2:
        return []; // Email preview step - no validation needed
      case 3:
        return ['street_address', 'city', 'state', 'zip_code'];
      case 4:
        return ['gender', 'shirt_size', 'coat_size', 'pant_size', 'shoe_size', 'hat_size'];
      case 5:
        return []; // Badge photo is optional
      case 6:
        return ['team_id', 'manager_id', 'recruiter_id'];
      case 7:
        return ['w9_completed'];
      case 8:
        return []; // Document uploads are optional for validation purposes
      case 9:
        return []; // Direct deposit fields are optional for validation purposes
      case 10:
        return []; // Voice recording is optional but encouraged
      case 11:
        return []; // Task acknowledgment is optional
      case 12:
        return []; // Review step
      default:
        return [];
    }
  };

  // Helper function to get a summary of entered data for verification
  const getStepDataSummary = (step: number, formData: any): string => {
    switch (step) {
      case 1:
        return `Name: ${formData.first_name} ${formData.last_name}, Phone: ${formData.cell_phone}, Email: ${formData.personal_email}`;
      case 2:
        return "Email credentials reviewed";
      case 3:
        return `Address: ${formData.street_address}, ${formData.city}, ${formData.state} ${formData.zip_code}`;
      case 4:
        return `Sizes - Shirt: ${formData.shirt_size}, Coat: ${formData.coat_size}, Pants: ${formData.pant_size}`;
      case 6:
        return `Team assignment and manager information saved`;
      case 7:
        return `W-9 completion status updated`;
      default:
        return "Information saved successfully";
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
    formatPhoneNumber,
  };
};