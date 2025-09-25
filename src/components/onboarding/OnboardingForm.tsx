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
        return <VoicePitchStep form={form} />;
      case 8:
        return <TaskAcknowledgmentStep form={form} />;
      case 9:
        return <ReviewSubmitStep form={form} generatedEmail={generatedEmail} onSubmit={submitForm} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TriGuard Roofing
          </h1>
          <p className="text-lg text-gray-600">Employee Onboarding System</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">
              Welcome to Your Onboarding Journey
            </CardTitle>
            <p className="text-blue-100 mt-2">
              Step {currentStep} of {FORM_STEPS.length}: {currentStepInfo?.title}
            </p>
            <p className="text-sm text-blue-200">
              {currentStepInfo?.description}
            </p>
            <div className="mt-4">
              <Progress value={progress} className="h-3 bg-blue-500/30" />
              <p className="text-xs text-blue-200 mt-1">
                {Math.round(progress)}% Complete
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <Form {...form}>
              <div className="space-y-6">
                {renderCurrentStep()}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <div className="flex gap-2">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isLoading ? 'Saving...' : 'Save Progress'}
                    </Button>

                    {currentStep < FORM_STEPS.length && (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        Continue
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center pt-4">
                  <div className="flex space-x-2">
                    {FORM_STEPS.map((step) => (
                      <div
                        key={step.id}
                        className={`w-3 h-3 rounded-full ${
                          step.id === currentStep
                            ? 'bg-blue-600'
                            : step.id < currentStep
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>

        {/* Admin Access */}
        <div className="flex justify-center mt-6">
          <Link to="/admin-login">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 TriGuard Roofing. All rights reserved.</p>
          <p className="mt-1">
            Need help? Contact our HR team at{' '}
            <a href="mailto:onboarding@triguardroofing.com" className="text-blue-600 hover:underline">
              onboarding@triguardroofing.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};