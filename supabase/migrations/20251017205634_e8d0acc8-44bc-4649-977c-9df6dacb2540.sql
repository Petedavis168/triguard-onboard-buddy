-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL, -- 'admin', 'manager', 'recruiter'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'new_onboarding', 'onboarding_completed', 'banking_updated', etc.
  related_id UUID, -- ID of related entity (onboarding_form_id, task_id, etc.)
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_type ON public.notifications(user_type);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Admins can see all notifications
CREATE POLICY "Admins can view all notifications"
ON public.notifications
FOR SELECT
USING (is_admin_user() OR is_admin_manager());

-- Managers can see their own notifications
CREATE POLICY "Managers can view their notifications"
ON public.notifications
FOR SELECT
USING (
  user_id IN (SELECT id FROM managers WHERE email = (auth.jwt() ->> 'email'::text))
  OR user_type = 'manager'
);

-- Recruiters can see their own notifications
CREATE POLICY "Recruiters can view their notifications"
ON public.notifications
FOR SELECT
USING (
  user_id IN (SELECT id FROM recruiters WHERE email = (auth.jwt() ->> 'email'::text))
  OR user_type = 'recruiter'
);

-- Users can mark their own notifications as read
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (
  is_admin_user() OR 
  is_admin_manager() OR
  user_id IN (SELECT id FROM managers WHERE email = (auth.jwt() ->> 'email'::text)) OR
  user_id IN (SELECT id FROM recruiters WHERE email = (auth.jwt() ->> 'email'::text))
);

-- Allow system to create notifications
CREATE POLICY "System can create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Function to create notification for new onboarding submission
CREATE OR REPLACE FUNCTION notify_new_onboarding()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notify when status changes to submitted or completed
  IF (TG_OP = 'UPDATE' AND NEW.status IN ('submitted', 'completed') AND OLD.status != NEW.status) OR
     (TG_OP = 'INSERT' AND NEW.status IN ('submitted', 'completed')) THEN
    
    -- Notify all admins
    INSERT INTO public.notifications (user_type, user_id, title, message, type, related_id)
    SELECT 
      'admin',
      id,
      CASE 
        WHEN NEW.status = 'completed' THEN 'Onboarding Completed'
        ELSE 'New Onboarding Submission'
      END,
      NEW.first_name || ' ' || NEW.last_name || ' has ' || 
      CASE 
        WHEN NEW.status = 'completed' THEN 'completed their onboarding'
        ELSE 'submitted their onboarding form'
      END,
      CASE 
        WHEN NEW.status = 'completed' THEN 'onboarding_completed'
        ELSE 'new_onboarding'
      END,
      NEW.id
    FROM admin_users
    WHERE is_active = true;
    
    -- Notify assigned manager if exists
    IF NEW.manager_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_type, user_id, title, message, type, related_id)
      VALUES (
        'manager',
        NEW.manager_id,
        'New Team Member Onboarding',
        NEW.first_name || ' ' || NEW.last_name || ' has completed their onboarding',
        'new_onboarding',
        NEW.id
      );
    END IF;
    
    -- Notify assigned recruiter if exists
    IF NEW.recruiter_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_type, user_id, title, message, type, related_id)
      VALUES (
        'recruiter',
        NEW.recruiter_id,
        'Recruit Completed Onboarding',
        NEW.first_name || ' ' || NEW.last_name || ' has completed their onboarding',
        'onboarding_completed',
        NEW.id
      );
    END IF;
  END IF;
  
  -- Notify when banking info is updated
  IF TG_OP = 'UPDATE' AND (
    (NEW.bank_routing_number IS NOT NULL AND OLD.bank_routing_number IS DISTINCT FROM NEW.bank_routing_number) OR
    (NEW.bank_account_number IS NOT NULL AND OLD.bank_account_number IS DISTINCT FROM NEW.bank_account_number) OR
    (NEW.direct_deposit_form_url IS NOT NULL AND OLD.direct_deposit_form_url IS DISTINCT FROM NEW.direct_deposit_form_url)
  ) THEN
    
    -- Notify all admins about banking update
    INSERT INTO public.notifications (user_type, user_id, title, message, type, related_id)
    SELECT 
      'admin',
      id,
      'Banking Info Updated',
      NEW.first_name || ' ' || NEW.last_name || ' has updated their direct deposit information',
      'banking_updated',
      NEW.id
    FROM admin_users
    WHERE is_active = true;
    
    -- Notify assigned manager
    IF NEW.manager_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_type, user_id, title, message, type, related_id)
      VALUES (
        'manager',
        NEW.manager_id,
        'Banking Info Updated',
        NEW.first_name || ' ' || NEW.last_name || ' has updated their direct deposit information',
        'banking_updated',
        NEW.id
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for onboarding notifications
CREATE TRIGGER trigger_notify_new_onboarding
AFTER INSERT OR UPDATE ON public.onboarding_forms
FOR EACH ROW
EXECUTE FUNCTION notify_new_onboarding();

-- Function to create notification when employee profile is created
CREATE OR REPLACE FUNCTION notify_new_employee_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notify all admins about new employee profile
  INSERT INTO public.notifications (user_type, user_id, title, message, type, related_id)
  SELECT 
    'admin',
    id,
    'New Rep Profile Created',
    'New rep profile created: ' || NEW.first_name || ' ' || NEW.last_name || ' (' || NEW.employee_id || ')',
    'new_rep',
    NEW.id
  FROM admin_users
  WHERE is_active = true;
  
  RETURN NEW;
END;
$$;

-- Create trigger for employee profile notifications
CREATE TRIGGER trigger_notify_new_employee_profile
AFTER INSERT ON public.employee_profiles
FOR EACH ROW
EXECUTE FUNCTION notify_new_employee_profile();