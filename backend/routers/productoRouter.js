//routers/productoRouter.js
////http://localhost:3000/api/productos
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { validarCampos } = require('../middlewares/validarCampos');

router.post('/', validarCampos('crearProducto'), productoController.crearProducto);
router.get('/', productoController.obtenerProductos);
router.get('/bajo-stock', productoController.obtenerProductosBajoStock);
router.get('/buscar/:nombre', productoController.buscarProductoPorNombre); // corregido el path
router.get('/:id', productoController.obtenerProductoPorId); // corregido aquí
router.put('/:id', validarCampos('actualizarProducto'), productoController.actualizarProducto);
router.delete('/:id', productoController.eliminarProducto);

module.exports = router;
