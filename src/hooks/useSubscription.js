import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSubscription() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  async function checkSubscription() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_plan, current_period_end')
      .eq('id', user.id)
      .single();

    // Auto-expire if past end date
    if (data?.current_period_end) {
      const expired = new Date(data.current_period_end) < new Date();
      if (expired && data.subscription_status === 'active') {
        await supabase
          .from('profiles')
          .update({ subscription_status: 'expired' })
          .eq('id', user.id);
        data.subscription_status = 'expired';
      }
    }

    setProfile(data);
    setLoading(false);
  }

  const isSubscribed = profile?.subscription_status === 'active';
  return { profile, loading, isSubscribed };
}