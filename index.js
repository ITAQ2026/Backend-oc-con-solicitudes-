const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL (usa tu variable de entorno de Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para Render/Supabase
  }
});

// --- RUTAS PARA ÓRDENES ESPECIALES ---

// 1. Obtener todas las órdenes (Historial)
app.get('/api/ordenes-especiales', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ordenes_especiales ORDER BY fecha DESC, id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener órdenes:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// 2. Guardar una nueva orden
app.post('/api/ordenes-especiales', async (req, res) => {
  const { 
    idOrden, proveedor, referencia, contacto, cotizacion, 
    formaPago, metodosPago, lugarEntrega, plazoEntrega, 
    datosFacturacion, items, solicito, autorizo 
  } = req.body;

  try {
    const query = `
      INSERT INTO ordenes_especiales (
        id_orden, proveedor, referencia, contacto, cotizacion, 
        forma_pago, metodos_pago, lugar_entrega, plazo_entrega, 
        datos_facturacion, items, solicito, autorizo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`;
    
    const values = [
      idOrden, proveedor, referencia, contacto, cotizacion, 
      formaPago, metodosPago, lugarEntrega, plazoEntrega, 
      datosFacturacion, JSON.stringify(items), solicito, autorizo
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al guardar orden:", err);
    res.status(500).json({ error: "Error al guardar en la base de datos" });
  }
});

// 3. Ruta para proveedores (la que ya usas en el front)
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
  console.log(`Servidor corriendo en puerto ${PORT}`);
});