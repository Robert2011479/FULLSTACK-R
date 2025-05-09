//controllers/productoController.js
const detalleVentaService = require('../services/detalleVentaService');
const { crearError } = require('../utils/crearError');

exports.obtenerDetallesPorVenta = async (req, res, next) => {
    try {
        const detalles = await detalleVentaService.obtenerPorVenta(req.params.id_venta);
        if (!detalles || detalles.length === 0) {
            return next(crearError(null, 'No se encontraron detalles para esta venta', 404));
        }
        res.status(200).json({
            status: 'success',
            data: detalles
        });
    } catch (err) {
        next(crearError(err, 'No se pudo obtener el detalle de la venta'));
    }
};

exports.eliminarDetalle = async (req, res, next) => {
    try {
        const eliminado = await detalleVentaService.eliminarDetalle(req.params.id_detalle);
        if (!eliminado) {
            return next(crearError(null, 'Detalle no encontrado', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

exports.actualizarDetalle = async (req, res, next) => {
    try {
        const detalle = await detalleVentaService.actualizarDetalle(
            req.params.id_detalle,
            req.body
        );
        if (!detalle) {
            return next(crearError(null, 'Detalle no encontrado', 404));
        }
        res.status(200).json({
            status: 'success',
            data: detalle
        });
    } catch (err) {
        next(err);
    }
};

