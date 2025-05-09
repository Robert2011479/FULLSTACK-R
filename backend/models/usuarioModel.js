//models/usuarioModel.js
// models/usuarioModel.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Usuario {
    static async crear({ nombre, correo, contraseña, rol }) {
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const { rows } = await db.query(
            `INSERT INTO usuarios (nombre, correo, contraseña, rol) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id_usuario, nombre, correo, rol`,
            [nombre, correo, hashedPassword, rol]
        );
        return rows[0];
    }

    static async obtenerTodos() {
        const { rows } = await db.query(
            'SELECT id_usuario, nombre, correo, rol FROM usuarios'
        );
        return rows;
    }

    static async obtenerPorId(id) {
        const { rows } = await db.query(
            'SELECT id_usuario, nombre, correo, rol FROM usuarios WHERE id_usuario = $1',
            [id]
        );
        return rows[0]; 
    }

    static async actualizar(id, datosActualizacion) {
        const campos = [];
        const valores = [];
        let contador = 1;

        if (datosActualizacion.nombre) {
            campos.push(`nombre = $${contador}`);
            valores.push(datosActualizacion.nombre);
            contador++;
        }

        if (datosActualizacion.correo) {
            campos.push(`correo = $${contador}`);
            valores.push(datosActualizacion.correo);
            contador++;
        }

        if (datosActualizacion.rol) {
            campos.push(`rol = $${contador}`);
            valores.push(datosActualizacion.rol);
            contador++;
        }

        if (campos.length === 0) return null;

        valores.push(id);

        const query = `
            UPDATE usuarios 
            SET ${campos.join(', ')} 
            WHERE id_usuario = $${contador} 
            RETURNING id_usuario, nombre, correo, rol
        `;
        const { rows } = await db.query(query, valores);
        return rows[0];
    }

    static async eliminar(id) {
        await db.query('DELETE FROM usuarios WHERE id_usuario = $1', [id]);
    }

    static async buscarPorCorreo(correo) {
        const { rows } = await db.query(
            'SELECT * FROM usuarios WHERE correo = $1',
            [correo]
        );
        return rows[0];
    }
}

module.exports = Usuario;
