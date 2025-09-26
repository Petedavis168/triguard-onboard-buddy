import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useManagerActivity = () => {
  const updateActivity = useCallback(async () => {
    const managerId = localStorage.getItem('managerId');
    const isAuthenticated = localStorage.getItem('managerAuthenticated') === 'true';
    
    if (!managerId || !isAuthenticated) return;

    try {
      await supabase
        .from('managers')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', managerId);
    } catch (error) {
      console.error('Failed to update manager activity:', error);
    }
  }, []);

  return { updateActivity };
};