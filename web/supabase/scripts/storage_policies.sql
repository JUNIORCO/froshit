CREATE POLICY "Enable read access for all users" ON "storage"."buckets"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

