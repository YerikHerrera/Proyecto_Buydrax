-- Si crear cuadrilla falla por creado_en NULL:
ALTER TABLE cuadrilla ALTER COLUMN creado_en SET DEFAULT NOW();
UPDATE cuadrilla SET creado_en = NOW() WHERE creado_en IS NULL;
