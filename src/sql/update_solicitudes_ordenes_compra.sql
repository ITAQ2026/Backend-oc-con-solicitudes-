ALTER TABLE solicitudes_compra
  ADD COLUMN IF NOT EXISTS imagen_referencia TEXT NULL;

ALTER TABLE ordenes_compra
  ADD COLUMN IF NOT EXISTS fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "solicitudId" INTEGER NULL,
  ADD COLUMN IF NOT EXISTS autoriza VARCHAR NULL,
  ADD COLUMN IF NOT EXISTS retira VARCHAR NULL,
  ADD COLUMN IF NOT EXISTS "condicionPago" VARCHAR NULL,
  ADD COLUMN IF NOT EXISTS "plazoPago" VARCHAR NULL,
  ADD COLUMN IF NOT EXISTS "formaPago" VARCHAR NULL,
  ADD COLUMN IF NOT EXISTS "direccionDescarga" VARCHAR NULL,
  ADD COLUMN IF NOT EXISTS "tiempoEstimado" VARCHAR NULL,
  ADD COLUMN IF NOT EXISTS especificaciones TEXT NULL,
  ADD COLUMN IF NOT EXISTS creado_por_nombre VARCHAR NULL,
  ADD COLUMN IF NOT EXISTS creado_por_email VARCHAR NULL,
  ADD COLUMN IF NOT EXISTS oculto_para_admins BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ocultado_por_email VARCHAR NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ordenes_compra'
      AND column_name = 'solicitud_id'
  ) THEN
    EXECUTE 'UPDATE ordenes_compra SET "solicitudId" = solicitud_id WHERE "solicitudId" IS NULL';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ordenes_compra'
      AND column_name = 'condicion_pago'
  ) THEN
    EXECUTE 'UPDATE ordenes_compra SET "condicionPago" = condicion_pago WHERE "condicionPago" IS NULL';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS ordenes_compra_items (
  id SERIAL PRIMARY KEY,
  producto VARCHAR NOT NULL,
  cantidad DOUBLE PRECISION NOT NULL,
  precio NUMERIC(10, 2) NULL,
  moneda VARCHAR NOT NULL DEFAULT 'PESOS',
  iva VARCHAR NOT NULL DEFAULT '21%',
  "ordenId" INTEGER NULL
);

ALTER TABLE ordenes_compra_items
  ADD COLUMN IF NOT EXISTS producto VARCHAR NOT NULL DEFAULT 'Producto sin nombre',
  ADD COLUMN IF NOT EXISTS cantidad DOUBLE PRECISION NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS precio NUMERIC(10, 2) NULL,
  ADD COLUMN IF NOT EXISTS moneda VARCHAR NOT NULL DEFAULT 'PESOS',
  ADD COLUMN IF NOT EXISTS iva VARCHAR NOT NULL DEFAULT '21%',
  ADD COLUMN IF NOT EXISTS "ordenId" INTEGER NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_ordenes_compra_items_orden'
  ) THEN
    ALTER TABLE ordenes_compra_items
      ADD CONSTRAINT fk_ordenes_compra_items_orden
      FOREIGN KEY ("ordenId") REFERENCES ordenes_compra(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ordenes_compra'
      AND column_name = 'items'
  ) THEN
    EXECUTE $migrate_items$
      INSERT INTO ordenes_compra_items (producto, cantidad, precio, moneda, iva, "ordenId")
      SELECT
        COALESCE(item->>'producto', item->>'descripcion', 'Producto sin nombre') AS producto,
        COALESCE(NULLIF(item->>'cantidad', '')::DOUBLE PRECISION, 1) AS cantidad,
        NULLIF(item->>'precio', '')::NUMERIC(10, 2) AS precio,
        COALESCE(NULLIF(item->>'moneda', ''), 'PESOS') AS moneda,
        COALESCE(NULLIF(item->>'iva', ''), '21%') AS iva,
        oc.id AS "ordenId"
      FROM ordenes_compra oc
      CROSS JOIN LATERAL jsonb_array_elements(
        CASE
          WHEN jsonb_typeof(oc.items::jsonb) = 'array' THEN oc.items::jsonb
          ELSE '[]'::jsonb
        END
      ) AS item
      WHERE oc.items IS NOT NULL
        AND oc.items <> ''
        AND NOT EXISTS (
          SELECT 1
          FROM ordenes_compra_items oci
          WHERE oci."ordenId" = oc.id
        )
    $migrate_items$;
  END IF;
END $$;
