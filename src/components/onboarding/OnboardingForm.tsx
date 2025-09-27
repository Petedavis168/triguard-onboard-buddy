import React from 'react';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useOnboardingForm } from '@/hooks/useOnboardingForm';
import { FORM_STEPS } from '@/types/onboarding';
import { Link } from 'react-router-dom';

// Import step components
import { BasicInformationStep } from './steps/BasicInformationStep';
import { EmailPreviewStep } from './steps/EmailPreviewStep';
import { AddressInformationStep } from './steps/AddressInformationStep';
import { GearSizingStep } from './steps/GearSizingStep';
import { BadgePhotoStep } from './steps/BadgePhotoStep';
import { TeamAssignmentStep } from './steps/TeamAssignmentStep';
import { W9FormStep } from './steps/W9FormStep';
import { DocumentUploadStep } from './steps/DocumentUploadStep';
import { DirectDepositStep } from './steps/DirectDepositStep';
import VoicePitchStep from './steps/VoicePitchStep';
import TaskAcknowledgmentStep from './steps/TaskAcknowledgmentStep';
import { RoleSelectionStep } from './steps/RoleSelectionStep';
import { ReviewSubmitStep } from './steps/ReviewSubmitStep';

interface OnboardingFormProps {
  formId?: string;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ formId }) => {
  const {
    form,
    currentStep,
    nextStep,
    prevStep,
    saveFormData,
    submitForm,
    isLoading,
    generatedEmail,
  } = useOnboardingForm(formId);

  const currentStepInfo = FORM_STEPS.find(step => step.id === currentStep);
  const progress = ((currentStep - 1) / (FORM_STEPS.length - 1)) * 100;

  const handleSave = async () => {
    const formData = form.getValues();
    const result = await saveFormData(formData, currentStep);
    if (result.success) {
      toast({
        title: "Progress Saved",
        description: "Your form has been saved successfully. You can continue later from where you left off.",
      });
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep form={form} generatedEmail={generatedEmail} />;
      case 2:
        return <RoleSelectionStep form={form} />;
      case 3:
        return <EmailPreviewStep form={form} generatedEmail={generatedEmail} />;
      case 4:
        return <AddressInformationStep form={form} />;
      case 5:
        return <GearSizingStep form={form} />;
      case 6:
        return <BadgePhotoStep form={form} />;
      case 7:
        return <TeamAssignmentStep form={form} />;
      case 8:
        return <TaskAcknowledgmentStep form={form} />;
      case 9:
        return <W9FormStep form={form} />;
      case 10:
        return <DocumentUploadStep form={form} />;
      case 11:
        return <DirectDepositStep form={form} />;
      case 12:
        return <VoicePitchStep form={form} />;
      case 13:
        return <ReviewSubmitStep form={form} generatedEmail={generatedEmail} onSubmit={submitForm} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/70 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Mobile-optimized Header */}
        <div className="text-center mb-4 sm:mb-8 px-2">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-xl font-bold text-white">TR</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                TriGuard Roofing
              </h1>
              <p className="text-sm text-muted-foreground">Employee Onboarding</p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-gradient-card">
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-xl relative overflow-hidden p-4 sm:p-6">
            <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
            
            <div className="relative z-10">
              <CardTitle className="text-lg sm:text-2xl font-bold text-center mb-2">
                Welcome to Your Onboarding
              </CardTitle>
              <p className="text-primary-foreground/90 text-center mb-3 text-sm">
                Step {currentStep} of {FORM_STEPS.length}: {currentStepInfo?.title}
              </p>
              
              <div className="space-y-3">
                <Progress value={progress} className="h-3 bg-white/20 rounded-full">
                  <div className="h-full bg-gradient-to-r from-white to-primary-glow rounded-full"></div>
                </Progress>
                <p className="text-xs text-primary-foreground/80 text-center font-medium">
                  {Math.round(progress)}% Complete
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-8 bg-white/80 backdrop-blur-sm">
            <Form {...form}>
              <div className="space-y-6">
                <div className="min-h-[400px]">
                  {renderCurrentStep()}
                </div>

                {/* Mobile-optimized Navigation */}
                <div className="border-t border-border/50 pt-6">
                  {/* Mobile: Stack buttons vertically with better spacing */}
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
                    <div className="flex justify-center sm:justify-start">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          disabled={isLoading}
                          className="flex items-center gap-2 min-h-[44px] px-6"
                          size="lg"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-3 order-first sm:order-last">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 min-h-[44px] px-4 flex-1 sm:flex-none"
                      >
                        <Save className="h-4 w-4" />
                        <span className="hidden sm:inline">{isLoading ? 'Saving...' : 'Save Progress'}</span>
                        <span className="sm:hidden">{isLoading ? 'Saving...' : 'Save'}</span>
                      </Button>

                      {currentStep < FORM_STEPS.length && (
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={isLoading}
                          className="flex items-center gap-2 min-h-[44px] px-6 bg-primary hover:bg-primary-dark flex-1 sm:flex-none"
                          size="lg"
                        >
                          Continue
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile-optimized Step Indicators */}
                <div className="flex justify-center pt-4">
                  <div className="flex space-x-2">
                    {FORM_STEPS.map((step) => (
                      <div
                        key={step.id}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                          step.id === currentStep
                            ? 'bg-primary scale-125'
                            : step.id < currentStep
                            ? 'bg-success'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>

        {/* Admin Access & Footer */}
        <div className="text-center mt-8 space-y-6">
          <Link to="/admin-login">
            <Button variant="glass" size="sm" className="gap-2 hover-glow">
              <Settings className="h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>

          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">© 2024 TriGuard Roofing. All rights reserved.</p>
            <p>
              Need help? Contact our HR team at{' '}
              <a 
                href="mailto:onboarding@triguardroofing.com" 
                className="text-primary hover:text-primary-dark underline-offset-2 hover:underline transition-colors"
              >
                onboarding@triguardroofing.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};