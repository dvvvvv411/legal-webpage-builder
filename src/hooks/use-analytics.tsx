import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate a session ID that persists during the browser session
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Track page views
export const usePageView = (lawFirmSlug?: string) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    
    const trackPageView = async () => {
      try {
        const sessionId = getSessionId();
        
        await supabase.from('analytics_events').insert({
          event_type: 'page_view',
          page_path: window.location.pathname,
          law_firm_slug: lawFirmSlug || null,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          session_id: sessionId,
        });
        
        hasTracked.current = true;
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackPageView();
  }, [lawFirmSlug]);
};

// Track custom events
export const useAnalyticsEvent = () => {
  const trackEvent = async (eventType: string, lawFirmSlug?: string) => {
    try {
      const sessionId = getSessionId();
      
      await supabase.from('analytics_events').insert({
        event_type: eventType,
        page_path: window.location.pathname,
        law_firm_slug: lawFirmSlug || null,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        session_id: sessionId,
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  return { trackEvent };
};