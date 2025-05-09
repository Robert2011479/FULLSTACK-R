// services/detalleVentaService.js
const DetalleVenta = require('../models/detalleVentasModel');

class DetalleVentaService {
    async obtenerPorVenta(id_venta) {
        return await DetalleVenta.obtenerPorVenta(id_venta);
    }

    async eliminarDetalle(id_detalle) {
        return await DetalleVenta.eliminar(id_detalle);
    }

    async actualizarDetalle(id_detalle, datosDetalle) {
        return await DetalleVenta.actualizar(id_detalle, datosDetalle);
    }
}

module.exports = new DetalleVentaService();