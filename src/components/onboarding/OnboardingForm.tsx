import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export const OnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              TriGuard Roofing - Employee Onboarding
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Step {currentStep} of {totalSteps}: Getting Started
            </p>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="p-8 border-2 border-dashed border-muted rounded-lg">
              <h3 className="text-lg font-medium mb-4">Welcome to TriGuard Roofing!</h3>
              <p className="text-muted-foreground mb-6">
                Your onboarding system is ready. The form will collect your information, 
                generate your company email, and notify your manager when complete.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-muted rounded">
                  <strong>✓ Email System</strong><br/>
                  Mailgun configured for notifications
                </div>
                <div className="p-4 bg-muted rounded">
                  <strong>✓ Database</strong><br/>
                  Ready for form submissions
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setCurrentStep(2)}
              disabled={currentStep >= totalSteps}
            >
              Start Onboarding Process
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};