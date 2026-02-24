import React, { useState, useEffect } from 'react';
import api from './api';
import { UserPlus, Trash2 } from 'lucide-react';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    cuit: '',
    direccion: '',
    localidad: '',
    provincia: '',
    telefono: '',
    codigo_postal: '' // Ajustado a snake_case para coincidir con la DB
  });

  const cargarProveedores = async () => {
    try {
      const res = await api.get('/proveedores');
      setProveedores(res.data);
    } catch (err) {
      console.error("Error al cargar", err);
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.cuit) {
      return alert("El Nombre y el CUIT son obligatorios");
    }
    
    try {
      // Enviamos el objeto con 'codigo_postal' a NestJS
      await api.post('/proveedores', formData);
      
      // Limpiamos el formulario con los nombres correctos
      setFormData({
        nombre: '', 
        cuit: '', 
        direccion: '', 
        localidad: '',
        provincia: '', 
        telefono: '', 
        codigo_postal: '' 
      });
      
      cargarProveedores(); 
      alert("Proveedor guardado con éxito");
    } catch (err) {
      console.error(err);
      alert("Error al guardar: Verifique la conexión o si el CUIT ya existe.");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este proveedor de la base de datos?")) return;
    try {
      await api.delete(`/proveedores/${id}`);
      cargarProveedores();
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b' }}>
        <UserPlus /> Gestión de Base de Datos: Proveedores
      </h2>
      
      <form onSubmit={guardar} style={styles.form}>
        <div style={{ gridColumn: 'span 1' }}>
          <label style={styles.label}>Razón Social / Nombre *</label>
          <input 
            name="nombre" 
            placeholder="Ej: Alpha Química" 
            value={formData.nombre} 
            onChange={handleChange} 
            style={styles.input} 
          />
        </div>

        <div style={{ gridColumn: 'span 1' }}>
          <label style={styles.label}>CUIT / CUIL *</label>
          <input 
            name="cuit" 
            placeholder="20-XXXXXXXX-X" 
            value={formData.cuit} 
            onChange={handleChange} 
            style={{...styles.input, borderColor: '#3b82f6'}} 
          />
        </div>

        <div style={{ gridColumn: 'span 1' }}>
          <label style={styles.label}>Teléfono de Contacto</label>
          <input 
            name="telefono" 
            placeholder="011 ..." 
            value={formData.telefono} 
            onChange={handleChange} 
            style={styles.input} 
          />
        </div>

        <div style={{ gridColumn: 'span 1' }}>
          <label style={styles.label}>Código Postal</label>
          <input 
            name="codigo_postal" // Cambiado para coincidir con la base de datos
            placeholder="C.P." 
            value={formData.codigo_postal} 
            onChange={handleChange} 
            style={styles.input} 
          />
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label style={styles.label}>Dirección Calle y Altura</label>
          <input 
            name="direccion" 
            placeholder="Calle Falsa 123" 
            value={formData.direccion} 
            onChange={handleChange} 
            style={styles.input} 
          />
        </div>

        <div style={{ gridColumn: 'span 1' }}>
          <label style={styles.label}>Localidad</label>
          <input 
            name="localidad" 
            placeholder="Ej: Villa María" 
            value={formData.localidad} 
            onChange={handleChange} 
            style={styles.input} 
          />
        </div>

        <div style={{ gridColumn: 'span 1' }}>
          <label style={styles.label}>Provincia</label>
          <input 
            name="provincia" 
            placeholder="Córdoba" 
            value={formData.provincia} 
            onChange={handleChange} 
            style={styles.input} 
          />
        </div>
        
        <button type="submit" style={styles.btnGuardar}>
          GUARDAR EN POSTGRESQL (RENDER)
        </button>
      </form>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
              <th style={styles.th}>Proveedor</th>
              <th style={styles.th}>CUIT</th>
              <th style={styles.th}>Dirección / Localidad</th>
              <th style={styles.th}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p) => (
              <tr key={p.id} style={styles.tr}>
                <td style={styles.td}><strong>{p.nombre}</strong></td>
                <td style={styles.td}><span style={styles.badge}>{p.cuit || 'S/D'}</span></td>
                <td style={styles.td}>
                  {p.direccion} <br />
                  <small style={{ color: '#64748b' }}>
                    {p.localidad}{p.provincia ? `, ${p.provincia}` : ''} 
                    {p.codigo_postal ? ` (${p.codigo_postal})` : ''}
                  </small>
                </td>
                <td style={styles.td}>
                  <button onClick={() => eliminar(p.id)} style={styles.btnEliminar}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px', padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '10px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '5px' },
  input: { width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  btnGuardar: { gridColumn: 'span 2', backgroundColor: '#1e293b', color: 'white', border: 'none', padding: '15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  tableContainer: { overflowX: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' },
  th: { padding: '12px', textAlign: 'left', fontSize: '13px' },
  td: { padding: '12px', borderBottom: '1px solid #e2e8f0', fontSize: '14px' },
  badge: { background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
  btnEliminar: { color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }
};

export default Proveedores;