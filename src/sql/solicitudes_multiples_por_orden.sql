-- Permite que una orden de compra agrupe varias solicitudes (mismo proveedor),
-- y que una solicitud siga pudiendo repartirse en varias órdenes.
-- ordenes_compra."solicitudId" se mantiene con la primera solicitud por compatibilidad.

CREATE TABLE IF NOT EXISTS ordenes_compra_solicitudes (
  orden_compra_id INTEGER NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
  solicitud_id INTEGER NOT NULL REFERENCES solicitudes_compra(id) ON DELETE CASCADE,
  PRIMARY KEY (orden_compra_id, solicitud_id)
);

CREATE INDEX IF NOT EXISTS idx_ordenes_compra_solicitudes_solicitud
  ON ordenes_compra_solicitudes (solicitud_id);

-- Copia los vínculos existentes (una solicitud por orden).
INSERT INTO ordenes_compra_solicitudes (orden_compra_id, solicitud_id)
SELECT oc.id, oc."solicitudId"
FROM ordenes_compra oc
JOIN solicitudes_compra s ON s.id = oc."solicitudId"
ON CONFLICT DO NOTHING;
