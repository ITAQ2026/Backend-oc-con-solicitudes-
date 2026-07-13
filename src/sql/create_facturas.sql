-- La tabla "facturas" nunca se creó en producción (el código ya la usa, la tabla no existe).
-- Seguro de correr más de una vez.

CREATE TABLE IF NOT EXISTS facturas (
  id SERIAL PRIMARY KEY,
  orden_compra_id INTEGER NULL,
  proveedor VARCHAR NOT NULL,
  descripcion TEXT NULL,
  solicitado_por VARCHAR NULL,
  fecha DATE NOT NULL,
  numero_factura VARCHAR NOT NULL,
  condicion_pago VARCHAR NOT NULL,
  monto_total NUMERIC(14, 2) NOT NULL,
  moneda VARCHAR NOT NULL DEFAULT 'PESOS',
  tipo_iva VARCHAR NOT NULL DEFAULT 'FINAL',
  fecha_registro TIMESTAMP NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_facturas_orden_compra'
  ) THEN
    ALTER TABLE facturas
      ADD CONSTRAINT fk_facturas_orden_compra
      FOREIGN KEY (orden_compra_id) REFERENCES ordenes_compra(id);
  END IF;
END $$;
