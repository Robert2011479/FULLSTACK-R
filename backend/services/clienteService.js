const Cliente = require('../models/clienteModel');

class ClienteService {
    async crearCliente(datosCliente) {
        return await Cliente.crear(datosCliente);
    }

    async obtenerTodos() {
        return await Cliente.obtenerTodos();
    }

    async obtenerPorId(id) {
        return await Cliente.obtenerPorId(id);
    }

    async actualizarCliente(id, datos) {
        return await Cliente.actualizar(id, datos);
    }

    async eliminarCliente(id) {
        return await Cliente.eliminar(id);
    }

    async buscarPorDni(dni) {
        return await Cliente.buscarPorDni(dni);
    }

    async buscarPorNombre(nombre) {
        return await Cliente.buscarPorNombre(nombre);
    }
}

module.exports = new ClienteService();