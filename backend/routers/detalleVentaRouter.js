//routers/detalleVentaRouter.js
//http://localhost:3000/api/ventas/detalles/venta/:id_venta
const express = require('express');
const router = express.Router();
const detalleVentaController = require('../controllers/detalleVentaController');

// Obtener detalles de una venta específica
router.get('/venta/:id_venta', detalleVentaController.obtenerDetallesPorVenta);
// Eliminar un detalle específico
router.delete('/:id_detalle', detalleVentaController.eliminarDetalle);
// Actualizar un detalle
router.put('/:id_detalle', detalleVentaController.actualizarDetalle);

module.exports = router;