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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, Play, Pause, User, Mail, MapPin, Shirt, FileText, Mic, CheckCircle, Edit, CreditCard, Download, ExternalLink } from 'lucide-react';
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

  const handleDownloadFile = async (url: string, bucketName: string, fileName: string) => {
    try {
      // Extract the file path from the URL
      const urlParts = url.split(`${bucketName}/`);
      const filePath = urlParts[1] || url;
      
      // Generate a signed URL for private bucket access
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, 3600); // Valid for 1 hour

      if (error) throw error;

      if (data?.signedUrl) {
        // Open the signed URL in a new tab
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download the file. Please try again.",
        variant: "destructive",
      });
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
      <DialogContent className="max-w-4xl max-h-[95vh] w-[95vw] p-0">
        <ScrollArea className="max-h-[95vh]">
          <div className="p-4 sm:p-6">
            <DialogHeader className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-lg sm:text-xl truncate">
                    {submission.first_name} {submission.last_name}
                  </DialogTitle>
                   <DialogDescription className="flex flex-wrap items-center gap-2 mt-2">
                     {getStatusBadge(submission.status)}
                     <span>•</span>
                     <span className="text-sm">Step {submission.current_step}/9</span>
                     {submission.generated_email && (
                       <>
                         <span className="hidden sm:inline">•</span>
                         <span className="text-sm truncate w-full sm:w-auto">{submission.generated_email}</span>
                       </>
                     )}
                     {!submission.voice_recording_url && (
                       <Badge variant="destructive" className="text-xs">
                         Missing Recording
                       </Badge>
                     )}
                   </DialogDescription>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                  ) : (
                    <>
                      <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </DialogHeader>

            <Tabs defaultValue="personal" className="w-full">
              {/* Mobile-optimized tabs with horizontal scroll */}
               <div className="overflow-x-auto mb-6">
                 <TabsList className="grid grid-cols-4 sm:grid-cols-7 w-full min-w-[300px]">
                   <TabsTrigger value="personal" className="text-xs sm:text-sm">Personal</TabsTrigger>
                   <TabsTrigger value="address" className="text-xs sm:text-sm">Address</TabsTrigger>
                   <TabsTrigger value="sizing" className="text-xs sm:text-sm">Sizing</TabsTrigger>
                   <TabsTrigger value="documents" className="text-xs sm:text-sm">Docs</TabsTrigger>
                   <TabsTrigger value="banking" className="text-xs sm:text-sm">Banking</TabsTrigger>
                   <TabsTrigger value="voice" className={`text-xs sm:text-sm ${!submission.voice_recording_url ? 'text-red-600 font-medium' : ''}`}>
                     Voice {!submission.voice_recording_url && <span className="text-red-500 ml-1">●</span>}
                   </TabsTrigger>
                   <TabsTrigger value="tasks" className="text-xs sm:text-sm">Tasks</TabsTrigger>
                 </TabsList>
               </div>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name" className="text-sm font-medium">First Name</Label>
                      {isEditing ? (
                        <Input
                          id="first_name"
                          value={editedData.first_name || ''}
                          onChange={(e) => setEditedData({...editedData, first_name: e.target.value})}
                          className="min-h-[44px]"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded text-sm">{submission.first_name}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name" className="text-sm font-medium">Last Name</Label>
                      {isEditing ? (
                        <Input
                          id="last_name"
                          value={editedData.last_name || ''}
                          onChange={(e) => setEditedData({...editedData, last_name: e.target.value})}
                          className="min-h-[44px]"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded text-sm">{submission.last_name}</div>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-sm font-medium">Generated Email</Label>
                      <div className="p-3 bg-gray-50 rounded flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm break-all">{submission.generated_email || 'Not generated'}</span>
                      </div>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-sm font-medium">Personal Email</Label>
                      <div className="p-3 bg-gray-50 rounded flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm break-all">{submission.personal_email || 'Not provided'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Gender</Label>
                      {isEditing ? (
                        <Select
                          value={editedData.gender || ''}
                          onValueChange={(value) => setEditedData({...editedData, gender: value})}
                        >
                          <SelectTrigger className="min-h-[44px]">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded capitalize text-sm">{submission.gender}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cell_phone" className="text-sm font-medium">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="cell_phone"
                          value={editedData.cell_phone || ''}
                          onChange={(e) => setEditedData({...editedData, cell_phone: e.target.value})}
                          className="min-h-[44px]"
                          placeholder="(555) 123-4567"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded text-sm">{submission.cell_phone || 'Not provided'}</div>
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
                   <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                     <div className="flex items-center justify-center mb-4">
                       <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                         <Mic className="h-8 w-8 text-red-600" />
                       </div>
                     </div>
                     <h3 className="text-lg font-semibold text-red-900 mb-2">No Voice Recording Available</h3>
                     <p className="text-red-700 mb-4">
                       This applicant has not submitted their voice pitch recording yet. 
                       This is typically completed in Step 6 of the onboarding process.
                     </p>
                     <div className="bg-red-100 rounded-lg p-3">
                       <p className="text-sm text-red-800">
                         <strong>Next Steps:</strong> The applicant should complete their voice recording 
                         to proceed with the onboarding process.
                       </p>
                     </div>
                   </div>
                 )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Uploaded Documents
                </CardTitle>
                <CardDescription>
                  Review all documents submitted during onboarding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* W9 Form Status */}
                <div className="space-y-3">
                  <h4 className="font-medium">W-9 Tax Form</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">W-9 Form</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.w9_completed ? 'Completed' : 'Not completed'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {submission.w9_completed ? (
                        <Badge className="bg-green-600">✓ Completed</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                      {submission.w9_submitted_at && (
                        <span className="text-sm text-muted-foreground">
                          {new Date(submission.w9_submitted_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Driver's License */}
                <div className="space-y-3">
                  <h4 className="font-medium">Driver's License</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Driver's License Copy</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.drivers_license_url ? 'Uploaded' : 'Not uploaded'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {submission.drivers_license_url ? (
                        <>
                          <Badge className="bg-green-600">✓ Uploaded</Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadFile(
                              submission.drivers_license_url, 
                              'employee-documents',
                              'drivers-license'
                            )}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Security Card */}
                <div className="space-y-3">
                  <h4 className="font-medium">Social Security Card</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Social Security Card Copy</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.social_security_card_url ? 'Uploaded' : 'Not uploaded'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {submission.social_security_card_url ? (
                        <>
                          <Badge className="bg-green-600">✓ Uploaded</Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadFile(
                              submission.social_security_card_url, 
                              'employee-documents',
                              'social-security-card'
                            )}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badge Photo */}
                <div className="space-y-3">
                  <h4 className="font-medium">Badge Photo</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="font-medium">Employee Badge Photo</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.badge_photo_url ? 'Uploaded' : 'Not uploaded'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {submission.badge_photo_url ? (
                        <>
                          <Badge className="bg-green-600">✓ Uploaded</Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadFile(
                              submission.badge_photo_url, 
                              'badge-photos',
                              'badge-photo'
                            )}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Documents Upload Status */}
                {submission.documents_uploaded_at && (
                  <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Documents uploaded:</strong> {new Date(submission.documents_uploaded_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Direct Deposit Information
                </CardTitle>
                <CardDescription>
                  Banking details for payroll direct deposit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Direct Deposit Status */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Direct Deposit Status</h4>
                    {submission.direct_deposit_confirmed ? (
                      <Badge className="bg-green-600">✓ Confirmed</Badge>
                    ) : (
                      <Badge variant="outline">Pending Confirmation</Badge>
                    )}
                  </div>
                  {submission.direct_deposit_completed_at && (
                    <p className="text-sm text-muted-foreground">
                      Completed: {new Date(submission.direct_deposit_completed_at).toLocaleString()}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Banking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {submission.account_type ? (
                        <span className="capitalize font-medium">{submission.account_type}</span>
                      ) : (
                        <span className="text-muted-foreground">Not specified</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bank Routing Number</Label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {submission.bank_routing_number ? (
                        <span className="font-mono">{submission.bank_routing_number}</span>
                      ) : (
                        <span className="text-muted-foreground">Not provided</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 col-span-full">
                    <Label>Bank Account Number</Label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {submission.bank_account_number ? (
                        <span className="font-mono">
                          ****{submission.bank_account_number.slice(-4)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Deposit Form */}
                {submission.direct_deposit_form_url && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Direct Deposit Form</h4>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Signed Direct Deposit Form</p>
                          <p className="text-sm text-muted-foreground">Uploaded document</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(submission.direct_deposit_form_url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        View Form
                      </Button>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-3">
                  <h4 className="font-medium">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cell Phone</Label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {submission.cell_phone || 'Not provided'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Personal Email</Label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {submission.personal_email || 'Not provided'}
                      </div>
                    </div>
                  </div>
                </div>
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionDetailsDialog;