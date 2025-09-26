-- Insert sample teams
INSERT INTO public.teams (id, name, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Sales Team', 'Responsible for customer acquisition and sales'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Marketing Team', 'Handles marketing campaigns and brand management'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Engineering Team', 'Software development and technical implementation'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Operations Team', 'Day-to-day operations and logistics');

-- Insert sample recruiters
INSERT INTO public.recruiters (id, first_name, last_name, email) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'Sarah', 'Johnson', 'sarah.johnson@company.com'),
  ('650e8400-e29b-41d4-a716-446655440002', 'Mike', 'Davis', 'mike.davis@company.com'),
  ('650e8400-e29b-41d4-a716-446655440003', 'Jennifer', 'Williams', 'jennifer.williams@company.com');

-- Insert sample admin users
INSERT INTO public.admin_users (id, first_name, last_name, email, password_hash, force_password_change) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', 'John', 'Smith', 'admin@company.com', public.hash_password('Admin123'), false),
  ('750e8400-e29b-41d4-a716-446655440002', 'Lisa', 'Brown', 'lisa.brown@company.com', public.hash_password('Admin456'), false);

-- Insert sample managers
INSERT INTO public.managers (id, first_name, last_name, email, password_hash, team_id, force_password_change, is_admin) VALUES
  ('850e8400-e29b-41d4-a716-446655440001', 'Robert', 'Wilson', 'robert.wilson@company.com', public.hash_password('Manager123'), '550e8400-e29b-41d4-a716-446655440001', false, true),
  ('850e8400-e29b-41d4-a716-446655440002', 'Maria', 'Garcia', 'maria.garcia@company.com', public.hash_password('Manager456'), '550e8400-e29b-41d4-a716-446655440002', false, false),
  ('850e8400-e29b-41d4-a716-446655440003', 'David', 'Miller', 'david.miller@company.com', public.hash_password('Manager789'), '550e8400-e29b-41d4-a716-446655440003', false, false),
  ('850e8400-e29b-41d4-a716-446655440004', 'Emily', 'Taylor', 'emily.taylor@company.com', public.hash_password('Manager999'), '550e8400-e29b-41d4-a716-446655440004', false, false);

-- Insert sample tasks
INSERT INTO public.tasks (id, title, description, team_id, manager_id, is_active) VALUES
  ('950e8400-e29b-41d4-a716-446655440001', 'Complete Safety Training', 'Complete mandatory workplace safety training module', '550e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', true),
  ('950e8400-e29b-41d4-a716-446655440002', 'Review Company Handbook', 'Read and acknowledge company policies and procedures', '550e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', true),
  ('950e8400-e29b-41d4-a716-446655440003', 'Set up Development Environment', 'Install and configure necessary development tools', '550e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440003', true),
  ('950e8400-e29b-41d4-a716-446655440004', 'Schedule 1-on-1 with Manager', 'Book initial meeting with direct manager', '550e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440004', true);

-- Insert sample email addresses
INSERT INTO public.email_addresses (id, first_name, last_name, email) VALUES
  ('a50e8400-e29b-41d4-a716-446655440001', 'Alex', 'Thompson', 'alex.thompson@company.com'),
  ('a50e8400-e29b-41d4-a716-446655440002', 'Jessica', 'Anderson', 'jessica.anderson@company.com'),
  ('a50e8400-e29b-41d4-a716-446655440003', 'Michael', 'White', 'michael.white@company.com'),
  ('a50e8400-e29b-41d4-a716-446655440004', 'Rachel', 'Martinez', 'rachel.martinez@company.com');

-- Insert sample onboarding forms
INSERT INTO public.onboarding_forms (
  id, first_name, last_name, generated_email, user_password, username,
  street_address, city, state, zip_code, 
  shipping_street_address, shipping_city, shipping_state, shipping_zip_code, same_as_mailing,
  gender, shirt_size, coat_size, pant_size, shoe_size, hat_size,
  team_id, manager_id, recruiter_id,
  status, current_step,
  cell_phone, personal_email, nickname
) VALUES
  (
    'b50e8400-e29b-41d4-a716-446655440001', 'Alex', 'Thompson', 'alex.thompson@company.com', 'SecurePass123', 'athompson',
    '123 Main St', 'New York', 'NY', '10001',
    '123 Main St', 'New York', 'NY', '10001', true,
    'male', 'l', 'l', 'l', '10.5', 'l',
    '550e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001',
    'completed', 8,
    '555-0123', 'alex.personal@gmail.com', 'Alex'
  ),
  (
    'b50e8400-e29b-41d4-a716-446655440002', 'Jessica', 'Anderson', 'jessica.anderson@company.com', 'SecurePass456', 'janderson',
    '456 Oak Ave', 'Los Angeles', 'CA', '90210',
    NULL, NULL, NULL, NULL, true,
    'female', 'm', 'm', 'm', '8', 'm',
    '550e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002',
    'in_progress', 5,
    '555-0456', 'jessica.personal@gmail.com', 'Jess'
  ),
  (
    'b50e8400-e29b-41d4-a716-446655440003', 'Michael', 'White', 'michael.white@company.com', 'SecurePass789', 'mwhite',
    '789 Pine Rd', 'Chicago', 'IL', '60601',
    '789 Pine Rd', 'Chicago', 'IL', '60601', true,
    'male', 'xl', 'xl', 'xl', '11', 'l',
    '550e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003',
    'submitted', 8,
    '555-0789', 'michael.personal@gmail.com', 'Mike'
  ),
  (
    'b50e8400-e29b-41d4-a716-446655440004', 'Rachel', 'Martinez', 'rachel.martinez@company.com', 'SecurePass999', 'rmartinez',
    '321 Elm St', 'Houston', 'TX', '77001',
    '555 Different Ave', 'Houston', 'TX', '77002', false,
    'female', 's', 's', 's', '7', 's',
    '550e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001',
    'draft', 3,
    '555-0999', 'rachel.personal@gmail.com', 'Rachel'
  );

-- Insert sample task assignments
INSERT INTO public.task_assignments (id, onboarding_form_id, task_id, acknowledged_at) VALUES
  ('c50e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', now() - interval '2 days'),
  ('c50e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440002', now() - interval '1 day'),
  ('c50e8400-e29b-41d4-a716-446655440003', 'b50e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440002', NULL),
  ('c50e8400-e29b-41d4-a716-446655440004', 'b50e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440003', now() - interval '3 days'),
  ('c50e8400-e29b-41d4-a716-446655440005', 'b50e8400-e29b-41d4-a716-446655440004', '950e8400-e29b-41d4-a716-446655440004', NULL);

-- Insert manager team relationships
INSERT INTO public.manager_teams (id, manager_id, team_id) VALUES
  ('d50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
  ('d50e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002'),
  ('d50e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003'),
  ('d50e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004');