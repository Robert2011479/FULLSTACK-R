//services/usuarioSercice.js
const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');

class UsuarioService {
    async crearUsuario(datosUsuario) {
        return await Usuario.crear(datosUsuario);
    }

    async obtenerTodos() {
        return await Usuario.obtenerTodos();
    }

    async obtenerPorId(id) {
        return await Usuario.obtenerPorId(id);
    }

    async actualizarUsuario(id, datos) {
        return await Usuario.actualizar(id, datos);
    }

    async eliminarUsuario(id) {
        return await Usuario.eliminar(id);
    }

    async buscarPorCorreo(correo) {
        return await Usuario.buscarPorCorreo(correo);
    }
}

module.exports = new UsuarioService();
