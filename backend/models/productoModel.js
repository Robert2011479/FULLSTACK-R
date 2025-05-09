//models/productoModel.js
const db = require('../config/db');
const { validarProducto } = require('../utils/validarDatos');


class Producto {
    static async crear({ nombre, descripcion, precio, stock, stock_minimo }) {
        validarProducto({ nombre, descripcion, precio, stock, stock_minimo });

        const { rows } = await db.query(
            'INSERT INTO productos (nombre, descripcion, precio, stock, stock_minimo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, descripcion, precio, stock, stock_minimo]
        );
        return rows[0];
    }

    static async obtenerTodos() {
        const { rows } = await db.query('SELECT * FROM productos');
        return rows;
    }

    static async obtenerPorId(id) {
        const { rows } = await db.query('SELECT * FROM productos WHERE id_producto = $1', [id]);
        return rows[0];
    }

    static async actualizar(id, { nombre, descripcion, precio, stock, stock_minimo }) {
        const { rows } = await db.query(
            'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, stock = $4, stock_minimo = $5 WHERE id_producto = $6 RETURNING *',
            [nombre, descripcion, precio, stock, stock_minimo, id]
        );
        return rows[0];
    }

    static async eliminar(id) {
        const { rowCount, rows } = await db.query(
            'DELETE FROM productos WHERE id_producto = $1 RETURNING *',
            [id]
        );
        return rowCount > 0 ? rows[0] : null;
    }

    static async buscarPorNombre(nombre) {
        const { rows } = await db.query('SELECT * FROM productos WHERE nombre ILIKE $1', [`%${nombre}%`]);
        return rows;
    }

    static async productosBajoStock() {
        const { rows } = await db.query('SELECT * FROM productos WHERE stock < stock_minimo');
        return rows;
    }

    static async actualizarStock(id, cantidad) {
        const { rows } = await db.query(
            'UPDATE productos SET stock = stock - $1 WHERE id_producto = $2 RETURNING *',
            [cantidad, id]
        );
        return rows[0];
    }
}

module.exports = Producto;