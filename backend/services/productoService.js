//services/productoSercice.js
const Producto = require('../models/productoModel');

class ProductoService {
    async crearProducto(datosProducto) {
        return await Producto.crear(datosProducto);
    }

    async obtenerTodos() {
        return await Producto.obtenerTodos();
    }

    async obtenerPorId(id) {
        return await Producto.obtenerPorId(id);
    }

    async actualizarProducto(id, datos) {
        return await Producto.actualizar(id, datos);
    }

    async eliminarProducto(id) {
        return await Producto.eliminar(id);
    }

    async buscarPorNombre(nombre) {
        return await Producto.buscarPorNombre(nombre);
    }

    async obtenerProductosBajoStock() {
        return await Producto.productosBajoStock();
    }
}

module.exports = new ProductoService();

