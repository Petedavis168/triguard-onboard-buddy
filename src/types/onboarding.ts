export type GenderType = 'male' | 'female';
export type SizeType = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';
export type ShoeSizeType = '6' | '6.5' | '7' | '7.5' | '8' | '8.5' | '9' | '9.5' | '10' | '10.5' | '11' | '11.5' | '12' | '12.5' | '13' | '13.5' | '14' | '14.5' | '15';
export type FormStatusType = 'draft' | 'in_progress' | 'completed' | 'submitted';
export type AccountType = 'checking' | 'savings';

export interface Team {
  id: string;
  name: string;
  description?: string;
}

export interface Manager {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  team_id?: string;
}

export interface Recruiter {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface OnboardingFormData {
  id?: string;
  first_name: string;
  last_name: string;
  generated_email?: string;
  nickname?: string;
  cell_phone?: string;
  personal_email?: string;
  
  // Address
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  
  // Shipping Address
  same_as_mailing: boolean;
  shipping_street_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip_code?: string;
  
  // Personal Info
  gender: GenderType;
  shirt_size: SizeType;
  coat_size: SizeType;
  pant_size: SizeType;
  shoe_size: ShoeSizeType;
  hat_size: SizeType;
  
  // Badge
  badge_photo_url?: string;
  
  // Team Info
  team_id: string;
  manager_id: string;
  recruiter_id: string;
  
  // W9
  w9_completed: boolean;
  w9_submitted_at?: string;
  
  // Voice Recording
  voice_recording_url?: string;
  voice_recording_completed_at?: string;
  
  // Document Uploads
  social_security_card_url?: string;
  drivers_license_url?: string;
  documents_uploaded_at?: string;
  
  // Direct Deposit
  direct_deposit_form_url?: string;
  bank_routing_number?: string;
  bank_account_number?: string;
  account_type?: AccountType;
  direct_deposit_confirmed?: boolean;
  direct_deposit_completed_at?: string;
  
  // Form Status
  status: FormStatusType;
  current_step: number;
}

export const FORM_STEPS = [
  { id: 1, title: 'Basic Information', description: 'Name and contact details' },
  { id: 2, title: 'Role Selection', description: 'Select your role' },
  { id: 3, title: 'Email Preview', description: 'Review your generated credentials' },
  { id: 4, title: 'Address Information', description: 'Mailing and shipping addresses' },
  { id: 5, title: 'Gear Sizing', description: 'Uniform and equipment sizes' },
  { id: 6, title: 'Badge Photo', description: 'Upload and edit your badge photo' },
  { id: 7, title: 'Team Assignment', description: 'Select team, manager, and recruiter' },
  { id: 8, title: 'Task Acknowledgment', description: 'Review and acknowledge your tasks' },
  { id: 9, title: 'W9 Form', description: 'Complete tax documentation' },
  { id: 10, title: 'Document Upload', description: 'Upload required identification documents' },
  { id: 11, title: 'Direct Deposit', description: 'Set up your direct deposit information' },
  { id: 12, title: 'Voice Pitch', description: 'Record your pitch to join our team' },
  { id: 13, title: 'Review & Submit', description: 'Review and submit your application' },
];

export const SIZE_OPTIONS: { value: SizeType; label: string }[] = [
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: 'xxl', label: 'XXL' },
  { value: 'xxxl', label: 'XXXL' },
];

export const SHOE_SIZE_OPTIONS: { value: ShoeSizeType; label: string }[] = [
  { value: '6', label: '6' },
  { value: '6.5', label: '6.5' },
  { value: '7', label: '7' },
  { value: '7.5', label: '7.5' },
  { value: '8', label: '8' },
  { value: '8.5', label: '8.5' },
  { value: '9', label: '9' },
  { value: '9.5', label: '9.5' },
  { value: '10', label: '10' },
  { value: '10.5', label: '10.5' },
  { value: '11', label: '11' },
  { value: '11.5', label: '11.5' },
  { value: '12', label: '12' },
  { value: '12.5', label: '12.5' },
  { value: '13', label: '13' },
  { value: '13.5', label: '13.5' },
  { value: '14', label: '14' },
  { value: '14.5', label: '14.5' },
  { value: '15', label: '15' },
];

export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];