import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Download, User, Mail, Phone, MapPin, Package, CreditCard, FileText, Camera, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RepProfileDetailDialogProps {
  profileId: string | null;
  onboardingFormId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OnboardingFormData {
  id: string;
  first_name: string;
  last_name: string;
  nickname: string | null;
  generated_email: string | null;
  personal_email: string | null;
  cell_phone: string | null;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  same_as_mailing: boolean;
  shipping_street_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip_code: string | null;
  gender: string;
  shirt_size: string;
  coat_size: string;
  pant_size: string;
  shoe_size: string;
  hat_size: string;
  badge_photo_url: string | null;
  employee_role: string | null;
  bank_routing_number: string | null;
  bank_account_number: string | null;
  account_type: string | null;
  direct_deposit_form_url: string | null;
  social_security_card_url: string | null;
  drivers_license_url: string | null;
  w9_completed: boolean;
  w9_submitted_at: string | null;
  created_at: string;
  status: string;
}

export const RepProfileDetailDialog: React.FC<RepProfileDetailDialogProps> = ({
  profileId,
  onboardingFormId,
  open,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState<OnboardingFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && onboardingFormId) {
      fetchOnboardingData();
    }
  }, [open, onboardingFormId]);

  const fetchOnboardingData = async () => {
    if (!onboardingFormId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('onboarding_forms')
        .select('*')
        .eq('id', onboardingFormId)
        .single();

      if (error) throw error;
      setFormData(data);
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
      toast({
        title: "Error",
        description: "Failed to load onboarding details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Success",
        description: `${filename} downloaded successfully`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const maskAccountNumber = (accountNumber: string | null) => {
    if (!accountNumber) return 'Not provided';
    return '****' + accountNumber.slice(-4);
  };

  if (!formData && !isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Rep Profile Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : formData ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-base font-semibold">{formData.first_name} {formData.last_name}</p>
                </div>
                {formData.nickname && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nickname</label>
                    <p className="text-base">{formData.nickname}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gender</label>
                  <p className="text-base capitalize">{formData.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <p className="text-base">{formData.employee_role || 'Not specified'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company Email</label>
                    <p className="text-base">{formData.generated_email || 'Not generated'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Personal Email</label>
                    <p className="text-base">{formData.personal_email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cell Phone</label>
                    <p className="text-base">{formData.cell_phone || 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mailing Address</label>
                  <p className="text-base">
                    {formData.street_address}<br />
                    {formData.city}, {formData.state} {formData.zip_code}
                  </p>
                </div>
                {!formData.same_as_mailing && formData.shipping_street_address && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Shipping Address</label>
                    <p className="text-base">
                      {formData.shipping_street_address}<br />
                      {formData.shipping_city}, {formData.shipping_state} {formData.shipping_zip_code}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gear Sizing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Gear Sizing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Shirt</label>
                    <p className="text-base uppercase">{formData.shirt_size}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Coat</label>
                    <p className="text-base uppercase">{formData.coat_size}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Pant</label>
                    <p className="text-base uppercase">{formData.pant_size}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Shoe</label>
                    <p className="text-base">{formData.shoe_size}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Hat</label>
                    <p className="text-base uppercase">{formData.hat_size}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Banking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Banking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Routing Number</label>
                  <p className="text-base font-mono">{formData.bank_routing_number || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Number</label>
                  <p className="text-base font-mono">{maskAccountNumber(formData.bank_account_number)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                  <p className="text-base capitalize">{formData.account_type || 'Not specified'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Documents & Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents & Photos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Badge Photo */}
                {formData.badge_photo_url && (
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Camera className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Badge Photo</p>
                        <p className="text-sm text-muted-foreground">Profile photo for badge</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(formData.badge_photo_url!, `${formData.first_name}_${formData.last_name}_badge_photo.jpg`)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}

                {/* Social Security Card */}
                {formData.social_security_card_url && (
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Social Security Card</p>
                        <p className="text-sm text-muted-foreground">Uploaded document</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(formData.social_security_card_url!, `${formData.first_name}_${formData.last_name}_ssn.pdf`)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}

                {/* Driver's License */}
                {formData.drivers_license_url && (
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Driver's License</p>
                        <p className="text-sm text-muted-foreground">Uploaded document</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(formData.drivers_license_url!, `${formData.first_name}_${formData.last_name}_license.pdf`)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}

                {/* Direct Deposit Form */}
                {formData.direct_deposit_form_url && (
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Direct Deposit Form</p>
                        <p className="text-sm text-muted-foreground">Uploaded document</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(formData.direct_deposit_form_url!, `${formData.first_name}_${formData.last_name}_direct_deposit.pdf`)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}

                {/* W-9 Status */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">W-9 Form</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.w9_completed ? `Completed on ${new Date(formData.w9_submitted_at!).toLocaleDateString()}` : 'Not completed'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={formData.w9_completed ? "default" : "secondary"}>
                    {formData.w9_completed ? 'Completed' : 'Pending'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Submission Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Submission Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                  <p className="text-base">{new Date(formData.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge variant={formData.status === 'completed' ? 'default' : 'secondary'}>
                    {formData.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
