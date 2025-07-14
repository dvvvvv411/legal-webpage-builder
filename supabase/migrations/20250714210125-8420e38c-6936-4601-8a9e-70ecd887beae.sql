-- First, let's see what law firm we're working with
-- Get the law firm ID for "Heß & Partner"
DO $$
DECLARE
    law_firm_uuid UUID;
    legal_area_uuid UUID;
BEGIN
    -- Get the law firm ID for "Heß & Partner"
    SELECT id INTO law_firm_uuid 
    FROM law_firms 
    WHERE slug = 'hess-partner';
    
    -- If law firm exists, add some legal area associations
    IF law_firm_uuid IS NOT NULL THEN
        -- Add associations for common legal areas
        -- First, let's add some basic legal areas if they don't exist
        INSERT INTO legal_areas (name, slug, description) VALUES
            ('Familienrecht', 'familienrecht', 'Scheidung, Unterhalt, Sorgerecht und weitere familienrechtliche Angelegenheiten'),
            ('Arbeitsrecht', 'arbeitsrecht', 'Kündigung, Abfindung, Arbeitsverträge und arbeitsrechtliche Streitigkeiten'),
            ('Mietrecht', 'mietrecht', 'Mieterhöhung, Kündigung, Nebenkostenabrechnung und Wohnungsmängel'),
            ('Verkehrsrecht', 'verkehrsrecht', 'Verkehrsunfälle, Bußgeldverfahren und verkehrsrechtliche Streitigkeiten'),
            ('Strafrecht', 'strafrecht', 'Strafverteidigung und strafrechtliche Beratung')
        ON CONFLICT (slug) DO NOTHING;
        
        -- Now add associations for this law firm
        INSERT INTO law_firm_legal_areas (law_firm_id, legal_area_id)
        SELECT law_firm_uuid, la.id
        FROM legal_areas la
        WHERE la.slug IN ('familienrecht', 'arbeitsrecht', 'mietrecht', 'verkehrsrecht', 'strafrecht')
        ON CONFLICT (law_firm_id, legal_area_id) DO NOTHING;
        
        RAISE NOTICE 'Added legal area associations for law firm: %', law_firm_uuid;
    ELSE
        RAISE NOTICE 'Law firm "Heß & Partner" with slug "hess-partner" not found';
    END IF;
END $$;