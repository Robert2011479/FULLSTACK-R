//routers/ventaRouter.js
//http://localhost:3000/api/ventas
const express = require('express');
const router = express.Router();
const detalleVentaRouter = require('./detalleVentaRouter');
const ventaController = require('../controllers/ventaController');
const { validarCampos } = require('../middlewares/validarCampos');

router.post('/', validarCampos('crearVenta'), ventaController.crearVenta);
router.get('/', ventaController.obtenerVentas);
router.get('/:id', ventaController.obtenerVenta);
router.get('/usuario/:id_usuario', ventaController.obtenerVentasPorUsuario);
router.get('/cliente/:id_cliente', ventaController.obtenerVentasPorCliente);
router.get('/fecha/rango', ventaController.obtenerVentasPorFecha);
router.use('/detalles', detalleVentaRouter);
router.put('/:id', ventaController.actualizarVenta);
router.delete('/:id', ventaController.eliminarVenta);

module.exports = router;