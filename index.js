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

// --- 1. SOLICITUDES ---
app.get('/api/solicitudes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM solicitudes ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("Error en solicitudes:", err);
    res.status(500).json({ error: "Error al traer solicitudes" });
  }
});

// --- 2. ÓRDENES ESPECIALES ---
app.get('/api/ordenes-especiales', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ordenes_especiales ORDER BY id_orden DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al traer historial especial" });
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`;
    
    const values = [
      id_orden, proveedor, referencia, contacto, cotizacion, 
      forma_pago, metodos_pago, lugar_entrega, plazo_entrega, 
      datos_facturacion, detalles_orden, solicito, autorizo
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al guardar especial:", err);
    res.status(500).json({ error: "Error al guardar orden especial" });
  }
});

// --- 3. ÓRDENES DE COMPRA (ESTA FALTABA) ---
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
    console.error("Error al guardar OC:", err);
    res.status(500).json({ error: "Error al guardar orden de compra" });
  }
});

// --- 4. PROVEEDORES ---
app.get('/api/proveedores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proveedores ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al traer proveedores" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Alpha Química Backend activo en puerto ${PORT}`);
});