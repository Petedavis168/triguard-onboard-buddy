import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, Square, Upload, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { UseFormReturn } from 'react-hook-form';

interface VoicePitchStepProps {
  form: UseFormReturn<any>;
}

const VoicePitchStep: React.FC<VoicePitchStepProps> = ({ form }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const voiceRecordingUrl = form.watch('voice_recording_url');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Share your pitch about why you want to work at TriGuard Roofing",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Please allow microphone access to record your pitch",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      toast({
        title: "Recording Stopped",
        description: "Your pitch has been recorded. Click upload to save it.",
      });
    }
  };

  const uploadRecording = async () => {
    if (!audioBlob) {
      toast({
        title: "No Recording",
        description: "Please record your pitch first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileName = `voice-pitch-${Date.now()}.webm`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('voice-recordings')
        .upload(filePath, audioBlob, {
          contentType: 'audio/webm',
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('voice-recordings')
        .getPublicUrl(filePath);

      // Update form with the recording URL
      form.setValue('voice_recording_url', publicUrl);
      form.setValue('voice_recording_completed_at', new Date().toISOString());

      toast({
        title: "Upload Successful",
        description: "Your voice pitch has been saved successfully",
      });

      setAudioBlob(null);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error uploading recording:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to save your recording. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Pitch Recording
        </CardTitle>
        <CardDescription>
          Record a 1-2 minute pitch about why you want to work at TriGuard Roofing and what you can bring to our team.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            <strong>Instructions:</strong> Please record a brief pitch explaining:
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Why you're interested in working at TriGuard Roofing</li>
              <li>What experience or skills you bring to the team</li>
              <li>Your goals and what you hope to achieve with us</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex flex-col items-center space-y-4">
          {!voiceRecordingUrl ? (
            <>
              <div className="text-center">
                {isRecording && (
                  <div className="text-2xl font-mono text-primary mb-4">
                    {formatTime(recordingTime)}
                  </div>
                )}
                
                <div className="flex gap-4">
                  {!isRecording ? (
                    <Button
                      type="button"
                      onClick={startRecording}
                      className="flex items-center gap-2"
                      size="lg"
                    >
                      <Mic className="h-5 w-5" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={stopRecording}
                      variant="destructive"
                      className="flex items-center gap-2"
                      size="lg"
                    >
                      <Square className="h-4 w-4" />
                      Stop Recording
                    </Button>
                  )}
                </div>
              </div>

              {audioBlob && !isRecording && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Recording completed! Click upload to save it.
                  </p>
                  <Button
                    type="button"
                    onClick={uploadRecording}
                    disabled={isUploading}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {isUploading ? 'Uploading...' : 'Upload Recording'}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Voice pitch recorded successfully!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your recording has been saved and will be reviewed by our team.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoicePitchStep;