import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Play, Pause, User, Mail, MapPin, Shirt, FileText, Mic, CheckCircle, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SubmissionDetailsDialogProps {
  submission: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const SubmissionDetailsDialog: React.FC<SubmissionDetailsDialogProps> = ({
  submission,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editedData, setEditedData] = useState(submission || {});
  const { toast } = useToast();

  React.useEffect(() => {
    if (submission) {
      setEditedData(submission);
    }
  }, [submission]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('onboarding_forms')
        .update({
          first_name: editedData.first_name,
          last_name: editedData.last_name,
          street_address: editedData.street_address,
          city: editedData.city,
          state: editedData.state,
          zip_code: editedData.zip_code,
          shipping_street_address: editedData.shipping_street_address,
          shipping_city: editedData.shipping_city,
          shipping_state: editedData.shipping_state,
          shipping_zip_code: editedData.shipping_zip_code,
          gender: editedData.gender,
          shirt_size: editedData.shirt_size,
          coat_size: editedData.coat_size,
          pant_size: editedData.pant_size,
          shoe_size: editedData.shoe_size,
          hat_size: editedData.hat_size,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submission.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Submission updated successfully",
      });

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const playVoiceRecording = () => {
    if (submission.voice_recording_url) {
      const audio = new Audio(submission.voice_recording_url);
      setIsPlaying(true);
      
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        toast({
          title: "Error",
          description: "Failed to play voice recording",
          variant: "destructive",
        });
        setIsPlaying(false);
      });

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to load voice recording",
          variant: "destructive",
        });
        setIsPlaying(false);
      };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'submitted':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl">
                {submission.first_name} {submission.last_name} - Submission Details
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-2">
                {getStatusBadge(submission.status)}
                <span>•</span>
                <span>Step {submission.current_step} of 9</span>
                {submission.generated_email && (
                  <>
                    <span>•</span>
                    <span>{submission.generated_email}</span>
                  </>
                )}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="sizing">Sizing</TabsTrigger>
            <TabsTrigger value="voice">Voice Pitch</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="first_name"
                      value={editedData.first_name || ''}
                      onChange={(e) => setEditedData({...editedData, first_name: e.target.value})}
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">{submission.first_name}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="last_name"
                      value={editedData.last_name || ''}
                      onChange={(e) => setEditedData({...editedData, last_name: e.target.value})}
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">{submission.last_name}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Generated Email</Label>
                  <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {submission.generated_email || 'Not generated'}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  {isEditing ? (
                    <Select
                      value={editedData.gender || ''}
                      onValueChange={(value) => setEditedData({...editedData, gender: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 bg-gray-50 rounded capitalize">{submission.gender}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Street Address</Label>
                    {isEditing ? (
                      <Input
                        value={editedData.street_address || ''}
                        onChange={(e) => setEditedData({...editedData, street_address: e.target.value})}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{submission.street_address}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    {isEditing ? (
                      <Input
                        value={editedData.city || ''}
                        onChange={(e) => setEditedData({...editedData, city: e.target.value})}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{submission.city}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    {isEditing ? (
                      <Input
                        value={editedData.state || ''}
                        onChange={(e) => setEditedData({...editedData, state: e.target.value})}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{submission.state}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>ZIP Code</Label>
                    {isEditing ? (
                      <Input
                        value={editedData.zip_code || ''}
                        onChange={(e) => setEditedData({...editedData, zip_code: e.target.value})}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{submission.zip_code}</div>
                    )}
                  </div>
                </div>

                {(submission.shipping_street_address || isEditing) && (
                  <>
                    <Separator />
                    <h4 className="font-medium">Shipping Address</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Shipping Street Address</Label>
                        {isEditing ? (
                          <Input
                            value={editedData.shipping_street_address || ''}
                            onChange={(e) => setEditedData({...editedData, shipping_street_address: e.target.value})}
                          />
                        ) : (
                          <div className="p-2 bg-gray-50 rounded">{submission.shipping_street_address || 'Same as mailing'}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Shipping City</Label>
                        {isEditing ? (
                          <Input
                            value={editedData.shipping_city || ''}
                            onChange={(e) => setEditedData({...editedData, shipping_city: e.target.value})}
                          />
                        ) : (
                          <div className="p-2 bg-gray-50 rounded">{submission.shipping_city || 'Same as mailing'}</div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sizing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shirt className="h-5 w-5" />
                  Gear Sizing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                {['shirt_size', 'coat_size', 'pant_size', 'shoe_size', 'hat_size'].map((field) => (
                  <div key={field} className="space-y-2">
                    <Label className="capitalize">{field.replace('_', ' ')}</Label>
                    {isEditing ? (
                      <Select
                        value={editedData[field] || ''}
                        onValueChange={(value) => setEditedData({...editedData, [field]: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.replace('_', ' ')}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field === 'shoe_size' ? (
                            Array.from({length: 20}, (_, i) => i + 6).map(size => (
                              <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                            ))
                          ) : (
                            ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'].map(size => (
                              <SelectItem key={size} value={size}>{size.toUpperCase()}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded uppercase">{submission[field]}</div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice Pitch Recording
                </CardTitle>
                <CardDescription>
                  Review the candidate's recorded pitch
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submission.voice_recording_url ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={playVoiceRecording}
                        disabled={isPlaying}
                        className="flex items-center gap-2"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-4 w-4" />
                            Playing...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Play Recording
                          </>
                        )}
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        Recorded: {submission.voice_recording_completed_at ? 
                          new Date(submission.voice_recording_completed_at).toLocaleString() : 
                          'Date not available'
                        }
                      </div>
                    </div>
                    <audio 
                      controls 
                      src={submission.voice_recording_url}
                      className="w-full"
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No voice recording submitted</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Task Acknowledgments
                </CardTitle>
                <CardDescription>
                  Tasks acknowledged by this team member
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Task acknowledgment feature coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionDetailsDialog;