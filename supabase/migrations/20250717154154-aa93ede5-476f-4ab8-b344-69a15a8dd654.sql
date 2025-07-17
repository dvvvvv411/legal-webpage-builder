-- Create analytics table for tracking law firm page visits
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  page_path TEXT NOT NULL,
  law_firm_slug TEXT,
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics events
CREATE POLICY "Analytics events are viewable by admins" 
ON public.analytics_events 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Analytics events can be inserted by everyone" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_analytics_events_law_firm_slug ON public.analytics_events(law_firm_slug);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);

-- Create a function to get analytics data for a specific law firm
CREATE OR REPLACE FUNCTION public.get_law_firm_analytics(
  firm_slug TEXT,
  start_date DATE,
  end_date DATE
) RETURNS TABLE (
  hour INTEGER,
  visits BIGINT,
  unique_sessions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXTRACT(HOUR FROM created_at)::INTEGER as hour,
    COUNT(*) as visits,
    COUNT(DISTINCT session_id) as unique_sessions
  FROM public.analytics_events
  WHERE law_firm_slug = firm_slug
    AND event_type = 'page_view'
    AND created_at >= start_date
    AND created_at < end_date + INTERVAL '1 day'
  GROUP BY EXTRACT(HOUR FROM created_at)
  ORDER BY hour;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;