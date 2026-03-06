const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ==========================================
// 1. LOGÍSTICA (Vehículos y Mantenimiento)
// ==========================================

app.get('/api/vehiculos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehiculos ORDER BY patente ASC');
    res.json(result.rows);
  } catch (err) {
    console.error("Error en vehículos:", err);
    res.status(500).json({ error: "Error al traer flota" });
  }
});

app.post('/api/vehiculos', async (req, res) => {
  const { patente, modelo, anio, vencimiento_vtv } = req.body;
  try {
    const query = 'INSERT INTO vehiculos (patente, modelo, anio, vencimiento_vtv) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await pool.query(query, [patente, modelo, anio, vencimiento_vtv]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al guardar vehículo" });
  }
});

app.delete('/api/vehiculos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM vehiculos WHERE id = $1', [req.params.id]);
    res.json({ message: "Vehículo eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar vehículo" });
  }
});

app.get('/api/ordenes-trabajo', async (req, res) => {
  try {
    const query = `
      SELECT ot.*, v.patente, v.modelo 
      FROM ordenes_trabajo ot 
      LEFT JOIN vehiculos v ON ot.vehiculo_id = v.id 
      ORDER BY ot.id DESC`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al traer historial de OT" });
  }
});

app.post('/api/ordenes-trabajo', async (req, res) => {
  const { vehiculoId, falla, tareas, kilometraje, responsable, repuestos } = req.body;
  try {
    const query = `
      INSERT INTO ordenes_trabajo (vehiculo_id, falla, tareas, kilometraje, responsable, repuestos, fecha)
      VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`;
    const result = await pool.query(query, [vehiculoId, falla, tareas, kilometraje, responsable, JSON.stringify(repuestos)]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al guardar OT" });
  }
});

// ==========================================
// 2. ADMINISTRACIÓN (Recibos de Caja)
// ==========================================

app.get('/api/recibos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recibos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al traer recibos" });
  }
});

app.post('/api/recibos', async (req, res) => {
  const { emisor, receptor, concepto, monto, condicion_pago } = req.body;
  try {
    const query = 'INSERT INTO recibos (emisor, receptor, concepto, monto, condicion_pago) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const result = await pool.query(query, [emisor, receptor, concepto, monto, condicion_pago]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al generar recibo" });
  }
});

// ==========================================
// 3. COMPRAS (Tus rutas originales)
// ==========================================

app.get('/api/solicitudes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM solicitudes ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error en solicitudes" });
  }
});

app.get('/api/ordenes-especiales', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ordenes_especiales ORDER BY id_orden DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error en órdenes especiales" });
  }
});

app.post('/api/ordenes-especiales', async (req, res) => {
  const { 
    id_orden, proveedor, referencia, contacto, cotizacion, 
    forma_pago, metodos_pago, lugar_entrega, plazo_entrega, 
    datos_facturacion, detalles_orden, solicito, autorizo 
  } = req.body;
  try {
    const query = `
      INSERT INTO ordenes_especiales (
        id_orden, proveedor, referencia, contacto, cotizacion, 
        forma_pago, metodos_pago, lugar_entrega, plazo_entrega, 
        datos_facturacion, detalles_orden, solicito, autorizo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;
    const result = await pool.query(query, [
      id_orden, proveedor, referencia, contacto, cotizacion, 
      forma_pago, metodos_pago, lugar_entrega, plazo_entrega, 
      datos_facturacion, detalles_orden, solicito, autorizo
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al guardar especial" });
  }
});

app.get('/api/ordenes-compra', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ordenes_compra ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al traer órdenes de compra" });
  }
});

app.post('/api/ordenes-compra', async (req, res) => {
  const { proveedorNombre, condicionPago, observaciones, autoriza, retira, solicitudId, items } = req.body;
  try {
    const query = `
      INSERT INTO ordenes_compra (proveedor, condicion_pago, observaciones, autoriza, retira, solicitud_id, items)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [proveedorNombre, condicionPago, observaciones, autoriza, retira, solicitudId, JSON.stringify(items)];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al guardar OC" });
  }
});

app.get('/api/proveedores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proveedores ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al traer proveedores" });
  }
});

// Puerto de escucha
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Alpha Química Backend activo en puerto ${PORT}`);
});