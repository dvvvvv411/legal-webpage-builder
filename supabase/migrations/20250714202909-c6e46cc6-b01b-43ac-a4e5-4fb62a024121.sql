-- Add lawyer_id and date/time fields to reviews table
ALTER TABLE public.reviews 
ADD COLUMN lawyer_id UUID REFERENCES public.lawyers(id) ON DELETE SET NULL,
ADD COLUMN review_date DATE,
ADD COLUMN review_time TIME;