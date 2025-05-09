//Models/ventaModel.js
const db = require('../config/db');
const { validarVenta } = require('../utils/validarDatos');

class Venta {
    static async crear({ id_usuario, id_cliente, total, detalles }) {
        validarVenta({ id_usuario, id_cliente, total, detalles }); // Asegúrate de tener esta validación
        
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
    
            // 1. Crear la venta principal
            const ventaResult = await client.query(
                'INSERT INTO ventas (id_usuario, id_cliente, total) VALUES ($1, $2, $3) RETURNING id_venta',
                [id_usuario, id_cliente, total]
            );
            const id_venta = ventaResult.rows[0].id_venta;
    
            // 2. Insertar cada detalle de venta
            for (const detalle of detalles) {
                await client.query(
                    'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, subtotal) VALUES ($1, $2, $3, $4)',
                    [id_venta, detalle.id_producto, detalle.cantidad, detalle.subtotal]
                );
    
                // 3. Actualizar el stock del producto
                await client.query(
                    'UPDATE productos SET stock = stock - $1 WHERE id_producto = $2',
                    [detalle.cantidad, detalle.id_producto]
                );
            }
    
            await client.query('COMMIT');
            
            // Obtener la venta completa con sus detalles para devolverla
            return await this.obtenerPorId(id_venta);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error en transacción de venta:', err); // Log detallado
            throw err;
        } finally {
            client.release();
        }
    }

    static async obtenerTodas() {
        const { rows } = await db.query(`
            SELECT v.*, u.nombre as vendedor, 
                   c.nombre as cliente_nombre, 
                   c.apellido_pat as cliente_apellido,
                   c.dni as cliente_dni,
                   c.telefono as cliente_telefono
            FROM ventas v
            JOIN usuarios u ON v.id_usuario = u.id_usuario
            JOIN cliente c ON v.id_cliente = c.id_cliente
            ORDER BY v.fecha_venta DESC
        `);
        return rows;
    }
    
    static async obtenerPorId(id) {
        const ventaQuery = db.query(`
            SELECT v.*, u.nombre as vendedor, 
                   c.nombre as cliente_nombre, 
                   c.apellido_pat as cliente_apellido, 
                   c.dni as cliente_dni,
                   c.telefono as cliente_telefono
            FROM ventas v
            JOIN usuarios u ON v.id_usuario = u.id_usuario
            JOIN cliente c ON v.id_cliente = c.id_cliente
            WHERE v.id_venta = $1
        `, [id]);
    
        const detallesQuery = db.query(`
            SELECT dv.*, p.nombre as producto 
            FROM detalle_venta dv
            JOIN productos p ON dv.id_producto = p.id_producto
            WHERE dv.id_venta = $1
        `, [id]);
    
        const [ventaResult, detallesResult] = await Promise.all([ventaQuery, detallesQuery]);
        
        if (!ventaResult.rows[0]) return null;
        
        return {
            ...ventaResult.rows[0],
            detalles: detallesResult.rows
        };
    }
    
    static async obtenerPorUsuario(id_usuario) {
        const { rows } = await db.query(`
            SELECT v.*, 
                   c.nombre as cliente_nombre,
                   c.telefono as cliente_telefono
            FROM ventas v
            JOIN cliente c ON v.id_cliente = c.id_cliente
            WHERE v.id_usuario = $1
            ORDER BY v.fecha_venta DESC
        `, [id_usuario]);
        return rows;
    }
    
    static async obtenerPorCliente(id_cliente) {
        const { rows } = await db.query(`
            SELECT v.*, u.nombre as vendedor,
                   c.telefono as cliente_telefono
            FROM ventas v
            JOIN usuarios u ON v.id_usuario = u.id_usuario
            JOIN cliente c ON v.id_cliente = c.id_cliente
            WHERE v.id_cliente = $1
            ORDER BY v.fecha_venta DESC
        `, [id_cliente]);
        return rows;
    }
    
    static async obtenerPorFecha(inicio, fin) {
        const { rows } = await db.query(`
            SELECT v.*, u.nombre as vendedor, 
                   c.nombre as cliente_nombre,
                   c.telefono as cliente_telefono
            FROM ventas v
            JOIN usuarios u ON v.id_usuario = u.id_usuario
            JOIN cliente c ON v.id_cliente = c.id_cliente
            WHERE v.fecha_venta BETWEEN $1 AND $2
            ORDER BY v.fecha_venta DESC
        `, [inicio, fin]);
        return rows;
    }

    static async actualizar(id, { id_cliente, total }) {
        const { rows } = await db.query(
            `UPDATE ventas SET id_cliente = $1, total = $2 
             WHERE id_venta = $3 RETURNING *`,
            [id_cliente, total, id]
        );
        return rows[0];
    }

    static async eliminar(id) {
        const { rowCount } = await db.query(
            `DELETE FROM ventas WHERE id_venta = $1`, [id]
        );
        return rowCount > 0;
    }
}

module.exports = Venta;