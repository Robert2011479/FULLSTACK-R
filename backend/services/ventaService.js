// services/ventaService.js
const Venta = require('../models/ventaModel');

class VentaService {
    async crearVenta(datosVenta) {
        return await Venta.crear(datosVenta);
    }

    async obtenerVentas() {
        return await Venta.obtenerTodas();
    }

    async obtenerVentaPorId(id) {
        return await Venta.obtenerPorId(id);
    }

    async obtenerVentasPorUsuario(id_usuario) {
        return await Venta.obtenerPorUsuario(id_usuario);
    }

    async obtenerVentasPorCliente(id_cliente) {
        return await Venta.obtenerPorCliente(id_cliente);
    }

    async obtenerVentasPorFecha(inicio, fin) {
        return await Venta.obtenerPorFecha(inicio, fin);
    }

    async actualizarVenta(id, datos) {
        return await Venta.actualizar(id, datos);
    }

    async eliminarVenta(id) {
        return await Venta.eliminar(id);
    }
}

module.exports = new VentaService();
