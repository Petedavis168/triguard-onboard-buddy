-- First, add the demo emails to the email_addresses table
INSERT INTO public.email_addresses (email, first_name, last_name, is_active) VALUES 
('carlos.martinez@triguardroofing.com', 'Carlos', 'Martinez', true),
('maria.rodriguez@triguardroofing.com', 'Maria', 'Rodriguez', true),
('jennifer.smith@triguardroofing.com', 'Jennifer', 'Smith', true),
('thomas.wilson@triguardroofing.com', 'Thomas', 'Wilson', true);

-- Now insert demo onboarding submissions
INSERT INTO public.onboarding_forms (
  first_name, last_name, generated_email, nickname, cell_phone, personal_email,
  street_address, city, state, zip_code, same_as_mailing,
  gender, shirt_size, coat_size, pant_size, shoe_size, hat_size,
  team_id, manager_id, recruiter_id,
  w9_completed, w9_submitted_at, status, current_step, submitted_at,
  social_security_card_url, drivers_license_url, direct_deposit_confirmed,
  bank_routing_number, bank_account_number, account_type, direct_deposit_form_url,
  voice_recording_url, voice_recording_completed_at, documents_uploaded_at, direct_deposit_completed_at
) VALUES 
(
  'Carlos', 'Martinez', 'carlos.martinez@triguardroofing.com', 'Charlie', '(214) 555-0123', 'carlos.personal@email.com',
  '456 Oak Street', 'Dallas', 'TX', '75201', true,
  'male', 'l', 'xl', 'l', '10', 'l',
  (SELECT id FROM teams WHERE name = 'Residential Installation' LIMIT 1),
  (SELECT id FROM managers WHERE first_name = 'Sarah' LIMIT 1),
  (SELECT id FROM recruiters WHERE first_name = 'David' LIMIT 1),
  true, NOW() - INTERVAL '2 days', 'submitted', 11, NOW() - INTERVAL '1 day',
  'https://example.com/docs/sscard-001.pdf', 'https://example.com/docs/license-001.pdf', true,
  '123456789', '987654321', 'checking', 'https://example.com/docs/dd-001.pdf',
  'https://example.com/audio/voice-001.mp3', NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
),
(
  'Maria', 'Rodriguez', 'maria.rodriguez@triguardroofing.com', null, '(512) 555-0456', 'maria.r@gmail.com',
  '789 Pine Avenue', 'Austin', 'TX', '78701', false,
  'female', 'm', 'm', 's', '7', 's',
  (SELECT id FROM teams WHERE name = 'Commercial Roofing' LIMIT 1),
  (SELECT id FROM managers WHERE first_name = 'Mike' LIMIT 1),
  (SELECT id FROM recruiters WHERE first_name = 'Lisa' LIMIT 1),
  true, NOW() - INTERVAL '5 days', 'submitted', 11, NOW() - INTERVAL '3 days',
  'https://example.com/docs/sscard-002.pdf', 'https://example.com/docs/license-002.pdf', true,
  '987654321', '123456789', 'savings', 'https://example.com/docs/dd-002.pdf',
  'https://example.com/audio/voice-002.mp3', NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days'
);

-- Update shipping address for Maria since same_as_mailing is false
UPDATE public.onboarding_forms 
SET 
  shipping_street_address = '123 Business Drive',
  shipping_city = 'Austin',
  shipping_state = 'TX',
  shipping_zip_code = '78702'
WHERE first_name = 'Maria' AND last_name = 'Rodriguez';