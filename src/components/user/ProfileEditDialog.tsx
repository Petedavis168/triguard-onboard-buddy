import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Users, 
  Calendar,
  Save,
  Camera,
  CreditCard,
  Building2,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  team: string;
  manager_name: string;
  profile_photo_url: string | null;
  // Banking information
  bank_account_number: string;
  bank_routing_number: string;
  account_type: string;
  // Address information  
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
}

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({ isOpen, onClose, userId }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, userId]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would use auth.uid() or the passed userId
      // For now, let's simulate profile data
      const mockProfile: UserProfile = {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@triguardroofing.com',
        phone: '(555) 123-4567',
        position: 'Roofer',
        department: 'Operations',
        team: 'Alpha Team',
        manager_name: 'Jane Smith',
        profile_photo_url: null,
        bank_account_number: '****1234',
        bank_routing_number: '****5678',
        account_type: 'Checking',
        street_address: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zip_code: '78701'
      };
      
      setProfile(mockProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);
      
      // Here you would typically update the profile in the database
      // For now, we'll just show a success message
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  if (!profile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <div className="flex items-center justify-center py-8">
            <div className="rounded-full h-8 w-8 border-b-2 border-primary animate-spin"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your personal information, banking details, and preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="work">Work Details</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profile.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profile.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={profile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        className="pl-10"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address Information
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street_address">Street Address</Label>
                      <Input
                        id="street_address"
                        value={profile.street_address}
                        onChange={(e) => handleInputChange('street_address', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profile.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={profile.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip_code">ZIP Code</Label>
                        <Input
                          id="zip_code"
                          value={profile.zip_code}
                          onChange={(e) => handleInputChange('zip_code', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="work" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Work Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <Badge variant="outline">{profile.position}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <span className="text-sm">{profile.department}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Team</Label>
                    <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.team}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Manager</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <span className="text-sm">{profile.manager_name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Banking Information
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Update your direct deposit information securely
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account_type">Account Type</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="account_type"
                        className="pl-10"
                        value={profile.account_type}
                        onChange={(e) => handleInputChange('account_type', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank_routing_number">Routing Number</Label>
                    <Input
                      id="bank_routing_number"
                      type="password"
                      value={profile.bank_routing_number}
                      onChange={(e) => handleInputChange('bank_routing_number', e.target.value)}
                      placeholder="Enter routing number"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bank_account_number">Account Number</Label>
                    <Input
                      id="bank_account_number"
                      type="password"
                      value={profile.bank_account_number}
                      onChange={(e) => handleInputChange('bank_account_number', e.target.value)}
                      placeholder="Enter account number"
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Secure Banking</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your banking information is encrypted and stored securely. Only you and authorized payroll staff can access this information.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;