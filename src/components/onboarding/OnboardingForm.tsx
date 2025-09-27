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
import { AddressInformationStep } from './steps/AddressInformationStep';
import { GearSizingStep } from './steps/GearSizingStep';
import { BadgePhotoStep } from './steps/BadgePhotoStep';
import { TeamAssignmentStep } from './steps/TeamAssignmentStep';
import { W9FormStep } from './steps/W9FormStep';
import { DocumentUploadStep } from './steps/DocumentUploadStep';
import { DirectDepositStep } from './steps/DirectDepositStep';
import VoicePitchStep from './steps/VoicePitchStep';
import TaskAcknowledgmentStep from './steps/TaskAcknowledgmentStep';
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
        return <AddressInformationStep form={form} />;
      case 3:
        return <GearSizingStep form={form} />;
      case 4:
        return <BadgePhotoStep form={form} />;
      case 5:
        return <TeamAssignmentStep form={form} />;
      case 6:
        return <W9FormStep form={form} />;
      case 7:
        return <DocumentUploadStep form={form} />;
      case 8:
        return <DirectDepositStep form={form} />;
      case 9:
        return <VoicePitchStep form={form} />;
      case 10:
        return <TaskAcknowledgmentStep form={form} />;
      case 11:
        return <ReviewSubmitStep form={form} generatedEmail={generatedEmail} onSubmit={submitForm} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/70 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 px-2">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-lg sm:text-xl font-bold text-white">TR</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                TriGuard Roofing
              </h1>
              <p className="text-sm sm:text-lg text-muted-foreground">Employee Onboarding System</p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-gradient-card mx-2 sm:mx-0">
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-xl relative overflow-hidden p-4 sm:p-6">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
            
            <div className="relative z-10">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2">
                Welcome to Your Onboarding Journey
              </CardTitle>
              <p className="text-primary-foreground/80 text-center mb-3 sm:mb-4 text-sm sm:text-base">
                Step {currentStep} of {FORM_STEPS.length}: {currentStepInfo?.title}
              </p>
              <p className="text-xs sm:text-sm text-primary-foreground/70 text-center mb-4 sm:mb-6 px-2">
                {currentStepInfo?.description}
              </p>
              
              <div className="space-y-2 sm:space-y-3">
                <Progress value={progress} className="h-2 sm:h-3 bg-white/20 rounded-full">
                  <div className="h-full bg-gradient-to-r from-white to-primary-glow rounded-full transition-all duration-300"></div>
                </Progress>
                <p className="text-xs text-primary-foreground/80 text-center">
                  {Math.round(progress)}% Complete
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-8 bg-white/80 backdrop-blur-sm">
            <Form {...form}>
              <div className="space-y-8">
                <div className="">
                  {renderCurrentStep()}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-8 border-t border-border/50">
                  <div className="flex gap-3">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                        size="lg"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                      size="lg"
                    >
                      <Save className="h-4 w-4" />
                      {isLoading ? 'Saving...' : 'Save Progress'}
                    </Button>

                    {currentStep < FORM_STEPS.length && (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={isLoading}
                        variant="premium"
                        className="flex items-center gap-2"
                        size="lg"
                      >
                        Continue
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center pt-6">
                  <div className="flex space-x-3">
                    {FORM_STEPS.map((step) => (
                      <div
                        key={step.id}
                        className={`step-indicator w-3 h-3 rounded-full transition-all duration-300 ${
                          step.id === currentStep
                            ? 'bg-primary shadow-glow active'
                            : step.id < currentStep
                            ? 'bg-success completed'
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