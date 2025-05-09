// models/detalleVentasModel.js
const db = require('../config/db');

class DetalleVenta {
    static async crear(id_venta, { id_producto, cantidad, subtotal }) {
        const { rows } = await db.query(
            `INSERT INTO detalle_venta 
             (id_venta, id_producto, cantidad, subtotal) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [id_venta, id_producto, cantidad, subtotal]
        );
        return rows[0];
    }

    static async obtenerPorVenta(id_venta) {
        try {
            const { rows } = await db.query(
                `SELECT dv.*, p.nombre as producto_nombre, p.precio as producto_precio,
                        p.descripcion as producto_descripcion
                 FROM detalle_venta dv
                 JOIN productos p ON dv.id_producto = p.id_producto
                 WHERE dv.id_venta = $1
                 ORDER BY dv.id_detalle`,
                [id_venta]
            );
            return rows;
        } catch (err) {
            console.error('Error al obtener detalles de venta:', err);
            throw err;
        }
    }

    static async eliminar(id_detalle) {
        const { rowCount } = await db.query(
            'DELETE FROM detalle_venta WHERE id_detalle = $1 RETURNING *', 
            [id_detalle]
        );
        return rowCount > 0;
    }

    static async actualizar(id_detalle, { cantidad, subtotal }) {
        const { rows } = await db.query(
            `UPDATE detalle_venta 
             SET cantidad = $1, subtotal = $2 
             WHERE id_detalle = $3 
             RETURNING *`,
            [cantidad, subtotal, id_detalle]
        );
        return rows[0];
    }
}

module.exports = DetalleVenta;