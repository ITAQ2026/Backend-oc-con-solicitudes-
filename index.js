const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para Render/Supabase
  }
});

// --- 1. RUTA DE SOLICITUDES (Vital para vincular en el Front) ---
app.get('/api/solicitudes', async (req, res) => {
  try {
    // Traemos todas las solicitudes. El frontend filtrará las "Aceptada"
    const result = await pool.query('SELECT * FROM solicitudes ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener solicitudes:", err);
    res.status(500).json({ error: "Error al traer solicitudes de la base de datos" });
  }
});

// --- 2. RUTAS PARA ÓRDENES ESPECIALES ---

// Obtener historial de órdenes especiales
app.get('/api/ordenes-especiales', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ordenes_especiales ORDER BY id_orden DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener órdenes:", err);
    res.status(500).json({ error: "Error en el servidor al traer historial" });
  }
});

// Guardar una nueva orden especial
app.post('/api/ordenes-especiales', async (req, res) => {
  // Recibimos los nombres de campos exactamente como los envía el Frontend
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
        datos_facturacion, items, solicito, autorizo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`;
    
    // El campo 'items' en la base de datos recibirá el contenido de 'detalles_orden'
    const values = [
      id_orden, proveedor, referencia, contacto, cotizacion, 
      forma_pago, metodos_pago, lugar_entrega, plazo_entrega, 
      datos_facturacion, detalles_orden, solicito, autorizo
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al guardar orden especial:", err);
    res.status(500).json({ error: "Error al guardar en la base de datos" });
  }
});

// --- 3. RUTA PARA PROVEEDORES ---
app.get('/api/proveedores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proveedores ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (err) {
    console.error("Error en proveedores:", err);
    res.status(500).json({ error: "Error al traer proveedores" });
  }
});

// --- 4. RUTA PARA ÓRDENES DE COMPRA (Básico) ---
app.get('/api/ordenes-compra', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ordenes_compra ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al traer órdenes de compra" });
  }
});

// Levantar Servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Alpha Química corriendo en puerto ${PORT}`);
});