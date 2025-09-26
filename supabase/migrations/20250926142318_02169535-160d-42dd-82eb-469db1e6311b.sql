-- Add login and activity tracking columns to managers table
ALTER TABLE public.managers 
ADD COLUMN last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN last_activity_at TIMESTAMP WITH TIME ZONE;

-- Update the password generation function to use company-relevant words
CREATE OR REPLACE FUNCTION public.generate_secure_password()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  words TEXT[] := ARRAY['Roofing', 'Triguard', 'Secure', 'Guard', 'Shield', 'Steel', 'Metal', 'Roof', 'Build', 'Strong'];
  numbers TEXT := '123456789';
  password TEXT := '';
  word1 TEXT;
  word2 TEXT;
  num1 TEXT;
  num2 TEXT;
BEGIN
  -- Select two random words
  word1 := words[floor(random() * array_length(words, 1))::int + 1];
  word2 := words[floor(random() * array_length(words, 1))::int + 1];
  
  -- Select two random numbers
  num1 := substr(numbers, floor(random() * length(numbers))::int + 1, 1);
  num2 := substr(numbers, floor(random() * length(numbers))::int + 1, 1);
  
  -- Combine: Word1 + Word2 + Number1 + Number2
  password := word1 || word2 || num1 || num2;
  
  RETURN password;
END;
$$;

-- Update existing manager passwords with new format
UPDATE public.managers 
SET password = public.generate_secure_password();