-- Create webhooks table to store webhook configurations
CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  endpoint_url TEXT,
  is_active BOOLEAN DEFAULT true,
  send_email BOOLEAN DEFAULT false,
  email_recipients TEXT[],
  email_subject TEXT,
  email_template TEXT,
  headers JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view all webhooks"
ON public.webhooks
FOR SELECT
USING (public.is_admin_user());

CREATE POLICY "Admins can create webhooks"
ON public.webhooks
FOR INSERT
WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update webhooks"
ON public.webhooks
FOR UPDATE
USING (public.is_admin_user());

CREATE POLICY "Admins can delete webhooks"
ON public.webhooks
FOR DELETE
USING (public.is_admin_user());

-- Add trigger for updated_at
CREATE TRIGGER update_webhooks_updated_at
BEFORE UPDATE ON public.webhooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();