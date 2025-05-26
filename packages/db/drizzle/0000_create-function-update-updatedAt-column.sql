-- This function is used to update the updated_at column in a table. 
-- A trigger needs to be created to call this function when a row is updated.
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
