//controllers/usuarioController.js
const usuarioService = require('../services/usuarioService');
const { crearError } = require('../utils/crearError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Si usas bcrypt para encriptar las contraseñas
// Crear usuario
exports.crearUsuario = async (req, res) => {
  try {
      const { nombre, correo, contraseña, rol } = req.body;
      
      // 1. Verificar si el correo existe
      const existeUsuario = await usuarioService.buscarPorCorreo(correo);
      if (existeUsuario) {
          return res.status(400).json({
              error: true,
              message: 'El correo ya está registrado'
          });
      }

      // 2. Crear usuario
      const usuarioCreado = await usuarioService.crearUsuario({
          nombre,
          correo,
          contraseña,
          rol
      });

      // 3. Responder sin datos sensibles
      res.status(201).json({
          success: true,
          usuario: {
              id: usuarioCreado.id_usuario,
              nombre: usuarioCreado.nombre,
              correo: usuarioCreado.correo,
              rol: usuarioCreado.rol
          }
      });

  } catch (error) {
      console.error('Error en crearUsuario:', error);
      res.status(500).json({
          error: true,
          message: 'Error al registrar usuario'
      });
  }
};


// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res, next) => {
    try {
        const usuarios = await usuarioService.obtenerTodos();
        res.status(200).json({
            status: 'success',
            results: usuarios.length,
            data: usuarios
        });
    } catch (err) {
        next(err);
    }
};

// Obtener un usuario por ID
exports.obtenerUsuario = async (req, res, next) => {
    try {
        const usuario = await usuarioService.obtenerPorId(req.params.id);
        if (!usuario) {
            throw crearError(null, 'Usuario no encontrado', 404);
        }
        res.status(200).json({
            status: 'success',
            data: usuario
        });
    } catch (err) {
        next(err);
    }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res, next) => {
    try {
        const usuario = await usuarioService.actualizarUsuario(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: usuario
        });
    } catch (err) {
        next(err);
    }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res, next) => {
    try {
        await usuarioService.eliminarUsuario(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};
// Modificar el método login
exports.login = async (req, res, next) => {
    try {
      const { correo, contraseña } = req.body;
      
      if (!correo || !contraseña) {
        return res.status(400).json({
          success: false,
          message: 'Correo y contraseña son requeridos'
        });
      }
  
      const usuario = await usuarioService.buscarPorCorreo(correo);
      
      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
  
      const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
      
      if (!contraseñaValida) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
  
      // Crear token JWT
      const token = jwt.sign(
        { 
          id: usuario.id_usuario, 
          rol: usuario.rol 
        },
        process.env.JWT_SECRET || 'secretodevelopment', // Usar variable de entorno o valor por defecto
        { expiresIn: '8h' }
      );
  
      // No enviar la contraseña en la respuesta
      const usuarioResponse = {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      };
  
      res.status(200).json({
        success: true,
        token,
        usuario: usuarioResponse
      });
    } catch (err) {
      next(err);
    }
  };