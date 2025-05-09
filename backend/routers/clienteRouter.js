const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { validarCampos } = require('../middlewares/validarCampos');

router.post('/', validarCampos('crearCliente'), clienteController.crearCliente);
router.get('/', clienteController.obtenerClientes);
router.get('/buscar-dni/:dni', clienteController.buscarClientePorDni);
router.get('/buscar-nombre/:nombre', clienteController.buscarClientePorNombre);
router.get('/:id', clienteController.obtenerClientePorId);
router.put('/:id', validarCampos('actualizarCliente'), clienteController.actualizarCliente);
router.delete('/:id', clienteController.eliminarCliente);

module.exports = router;