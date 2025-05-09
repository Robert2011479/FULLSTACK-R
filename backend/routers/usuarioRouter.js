//roters/usuarioRouter.js
// /usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { validarCampos } = require('../middlewares/validarCampos');

router.post('/', validarCampos('crearUsuario'), usuarioController.crearUsuario);
router.post('/login', validarCampos('login'), usuarioController.login);
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuario);
router.put('/:id', validarCampos('actualizarUsuario'), usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;