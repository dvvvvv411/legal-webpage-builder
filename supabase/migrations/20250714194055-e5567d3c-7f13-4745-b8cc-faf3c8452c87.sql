-- Create storage bucket for law firm logos
INSERT INTO storage.buckets (id, name, public) VALUES ('law-firm-logos', 'law-firm-logos', true);

-- Create policies for logo uploads
CREATE POLICY "Law firm logos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'law-firm-logos');

CREATE POLICY "Authenticated users can upload law firm logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'law-firm-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update law firm logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'law-firm-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete law firm logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'law-firm-logos' AND auth.role() = 'authenticated');