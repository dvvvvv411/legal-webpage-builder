-- Create enum for review ratings
CREATE TYPE public.review_rating AS ENUM ('1', '2', '3', '4', '5');

-- Create legal areas master table
CREATE TABLE public.legal_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create law firms table
CREATE TABLE public.law_firms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  phone TEXT,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lawyers table
CREATE TABLE public.lawyers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  law_firm_id UUID NOT NULL REFERENCES public.law_firms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  specialization TEXT,
  bio TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for law firm legal areas
CREATE TABLE public.law_firm_legal_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  law_firm_id UUID NOT NULL REFERENCES public.law_firms(id) ON DELETE CASCADE,
  legal_area_id UUID NOT NULL REFERENCES public.legal_areas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(law_firm_id, legal_area_id)
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  law_firm_id UUID NOT NULL REFERENCES public.law_firms(id) ON DELETE CASCADE,
  legal_area_id UUID REFERENCES public.legal_areas(id) ON DELETE SET NULL,
  initials TEXT NOT NULL,
  rating review_rating NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  scope TEXT,
  avatar_color TEXT DEFAULT '#6B7280',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.legal_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.law_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.law_firm_legal_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for legal areas (public read, admin write)
CREATE POLICY "Legal areas are viewable by everyone" 
ON public.legal_areas 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage legal areas" 
ON public.legal_areas 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Create policies for law firms (public read, admin write)
CREATE POLICY "Law firms are viewable by everyone" 
ON public.law_firms 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage law firms" 
ON public.law_firms 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Create policies for lawyers (public read, admin write)
CREATE POLICY "Lawyers are viewable by everyone" 
ON public.lawyers 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage lawyers" 
ON public.lawyers 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Create policies for law firm legal areas (public read, admin write)
CREATE POLICY "Law firm legal areas are viewable by everyone" 
ON public.law_firm_legal_areas 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage law firm legal areas" 
ON public.law_firm_legal_areas 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Create policies for reviews (public read, admin write)
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage reviews" 
ON public.reviews 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_legal_areas_updated_at
  BEFORE UPDATE ON public.legal_areas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_law_firms_updated_at
  BEFORE UPDATE ON public.law_firms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lawyers_updated_at
  BEFORE UPDATE ON public.lawyers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample legal areas
INSERT INTO public.legal_areas (name, slug, description) VALUES
  ('Arbeitsrecht', 'arbeitsrecht', 'Rechtliche Beratung in Arbeitsangelegenheiten'),
  ('Familienrecht', 'familienrecht', 'Scheidung, Sorgerecht und Familienangelegenheiten'),
  ('Strafrecht', 'strafrecht', 'Verteidigung in Strafverfahren'),
  ('Zivilrecht', 'zivilrecht', 'Allgemeines Zivilrecht und Vertragsrecht'),
  ('Steuerrecht', 'steuerrecht', 'Steuerberatung und Steuerstreitigkeiten'),
  ('Immobilienrecht', 'immobilienrecht', 'Kauf, Verkauf und Vermietung von Immobilien'),
  ('Unternehmensrecht', 'unternehmensrecht', 'Gesellschaftsrecht und Unternehmensgründung'),
  ('Verkehrsrecht', 'verkehrsrecht', 'Unfälle und Verkehrsdelikte'),
  ('Erbrecht', 'erbrecht', 'Testament, Erbschaft und Nachlassabwicklung'),
  ('Mietrecht', 'mietrecht', 'Mietverträge und Mietstreitigkeiten');