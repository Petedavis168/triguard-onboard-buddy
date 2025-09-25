import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Download, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';

interface W9FormStepProps {
  form: UseFormReturn<any>;
}

export const W9FormStep: React.FC<W9FormStepProps> = ({ form }) => {
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const w9Completed = form.watch('w9_completed');

  const handleDownloadW9 = () => {
    // Open the W9 form in a new tab
    window.open('https://www.irs.gov/pub/irs-pdf/fw9.pdf', '_blank');
    setHasDownloaded(true);
  };

  const handleW9Completion = (completed: boolean) => {
    form.setValue('w9_completed', completed);
    if (completed) {
      form.setValue('w9_submitted_at', new Date().toISOString());
    } else {
      form.setValue('w9_submitted_at', null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            W-9 Tax Form
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete and save your W-9 form for tax purposes. This is required for employment.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasDownloaded && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You must download and complete the W-9 form before proceeding with your onboarding.
              </AlertDescription>
            </Alert>
          )}

          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">IRS Form W-9</h4>
                <p className="text-sm text-muted-foreground">
                  Request for Taxpayer Identification Number and Certification
                </p>
              </div>
              <Badge variant={hasDownloaded ? "default" : "secondary"}>
                {hasDownloaded ? "Downloaded" : "Required"}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleDownloadW9}
                className="gap-2"
                variant={hasDownloaded ? "outline" : "default"}
              >
                <Download className="h-4 w-4" />
                Download W-9 Form
              </Button>
              
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open('https://www.irs.gov/forms-pubs/about-form-w-9', '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                W-9 Instructions
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Download the W-9 form using the button above</li>
              <li>Fill out all required fields completely and accurately</li>
              <li>Sign and date the form</li>
              <li>Save the completed form to your device</li>
              <li>Upload the completed form to your recruiting platform</li>
              <li>Check the box below to confirm completion</li>
            </ol>
          </div>

          <FormField
            control={form.control}
            name="w9_completed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={handleW9Completion}
                    disabled={!hasDownloaded}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className={!hasDownloaded ? "text-muted-foreground" : ""}>
                    I have completed and saved my W-9 form *
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    By checking this box, you confirm that you have filled out, signed, and saved your W-9 form.
                    You must upload this form to your recruiting platform.
                  </p>
                </div>
              </FormItem>
            )}
          />

          {w9Completed && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Great!</strong> You've confirmed completion of your W-9 form. 
                Make sure to upload it to your recruiting platform as instructed.
              </AlertDescription>
            </Alert>
          )}

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <Badge variant="secondary">Important Reminders</Badge>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• The W-9 form is required by law for employment tax purposes</li>
              <li>• Ensure all information matches your Social Security records</li>
              <li>• Keep a copy of the completed form for your records</li>
              <li>• Upload the form to your recruiting platform as directed</li>
              <li>• Contact HR if you have questions about completing the form</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};