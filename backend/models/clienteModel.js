const db = require('../config/db');
const { validarCliente } = require('../utils/validarDatos');

class Cliente {
    static async crear({ dni, nombre, apellido_pat, apellido_mat, telefono, direccion }) {
        validarCliente({ dni, nombre, apellido_pat, apellido_mat });

        const { rows } = await db.query(
            'INSERT INTO cliente (dni, nombre, apellido_pat, apellido_mat, telefono, direccion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [dni, nombre, apellido_pat, apellido_mat, telefono, direccion]
        );
        return rows[0];
    }

    static async obtenerTodos() {
        const { rows } = await db.query('SELECT * FROM cliente');
        return rows;
    }

    static async obtenerPorId(id) {
        const { rows } = await db.query('SELECT * FROM cliente WHERE id_cliente = $1', [id]);
        return rows[0];
    }

    static async actualizar(id, { dni, nombre, apellido_pat, apellido_mat, telefono, direccion }) {
        const { rows } = await db.query(
            'UPDATE cliente SET dni = $1, nombre = $2, apellido_pat = $3, apellido_mat = $4, telefono = $5, direccion = $6 WHERE id_cliente = $7 RETURNING *',
            [dni, nombre, apellido_pat, apellido_mat, telefono, direccion, id]
        );
        return rows[0];
    }

    static async eliminar(id) {
        const { rowCount, rows } = await db.query(
            'DELETE FROM cliente WHERE id_cliente = $1 RETURNING *',
            [id]
        );
        return rowCount > 0 ? rows[0] : null;
    }

    static async buscarPorDni(dni) {
        const { rows } = await db.query('SELECT * FROM cliente WHERE dni ILIKE $1', [`%${dni}%`]);
        return rows;
    }

    static async buscarPorNombre(nombre) {
        const { rows } = await db.query('SELECT * FROM cliente WHERE nombre ILIKE $1 OR apellido_pat ILIKE $1 OR apellido_mat ILIKE $1', [`%${nombre}%`]);
        return rows;
    }
}

module.exports = Cliente;