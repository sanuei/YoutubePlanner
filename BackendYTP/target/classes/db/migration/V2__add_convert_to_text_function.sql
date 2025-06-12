CREATE OR REPLACE FUNCTION convert_to_text(bytea) RETURNS text AS $$
BEGIN
    RETURN convert_from($1, 'UTF8');
END;
$$ LANGUAGE plpgsql; 