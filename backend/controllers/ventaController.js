//controllers/ventaController.js
const ventaService = require('../services/ventaService');
const { crearError } = require('../utils/crearError');

exports.crearVenta = async (req, res, next) => {
    try {
        const { id_usuario, id_cliente, total, detalles } = req.body;
        const venta = await ventaService.crearVenta({ id_usuario, id_cliente, total, detalles });
        res.status(201).json({ status: 'success', data: venta });
    } catch (err) {
        next(crearError(err, 'No se pudo crear la venta'));
    }
};

exports.obtenerVentas = async (req, res, next) => {
    try {
        const ventas = await ventaService.obtenerVentas();
        res.status(200).json({ status: 'success', data: ventas });
    } catch (err) {
        next(crearError(err, 'No se pudieron obtener las ventas'));
    }
};

exports.obtenerVenta = async (req, res, next) => {
    try {
        const venta = await ventaService.obtenerVentaPorId(req.params.id);
        if (!venta) return next(crearError(null, 'Venta no encontrada', 404));
        res.status(200).json({ status: 'success', data: venta });
    } catch (err) {
        next(crearError(err, 'No se pudo obtener la venta'));
    }
};

exports.obtenerVentasPorUsuario = async (req, res, next) => {
    try {
        const ventas = await ventaService.obtenerVentasPorUsuario(req.params.id_usuario);
        res.status(200).json({ status: 'success', data: ventas });
    } catch (err) {
        next(crearError(err, 'No se pudieron obtener las ventas del usuario'));
    }
};

exports.obtenerVentasPorCliente = async (req, res, next) => {
    try {
        const ventas = await ventaService.obtenerVentasPorCliente(req.params.id_cliente);
        res.status(200).json({ status: 'success', data: ventas });
    } catch (err) {
        next(crearError(err, 'No se pudieron obtener las ventas del cliente'));
    }
};

exports.obtenerVentasPorFecha = async (req, res, next) => {
    try {
        const { inicio, fin } = req.query;
        if (!inicio || !fin) {
            return next(crearError(null, 'Debe proporcionar fechas de inicio y fin', 400));
        }
        const ventas = await ventaService.obtenerVentasPorFecha(inicio, fin);
        res.status(200).json({ status: 'success', data: ventas });
    } catch (err) {
        next(crearError(err, 'No se pudieron obtener las ventas por fecha'));
    }
};

exports.actualizarVenta = async (req, res, next) => {
    try {
        const venta = await ventaService.actualizarVenta(req.params.id, req.body);
        if (!venta) return next(crearError(null, 'Venta no encontrada', 404));
        res.status(200).json({ status: 'success', data: venta });
    } catch (err) {
        next(crearError(err, 'No se pudo actualizar la venta'));
    }
};

exports.eliminarVenta = async (req, res, next) => {
    try {
        const eliminado = await ventaService.eliminarVenta(req.params.id);
        if (!eliminado) return next(crearError(null, 'Venta no encontrada', 404));
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        next(crearError(err, 'No se pudo eliminar la venta'));
    }
};