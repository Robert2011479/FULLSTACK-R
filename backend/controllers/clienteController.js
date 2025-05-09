const clienteService = require('../services/clienteService');
const { crearError } = require('../utils/crearError');
const { validarCliente } = require('../utils/validarDatos');

const crearCliente = async (req, res, next) => {
  try {
    const datos = req.body;
    validarCliente(datos);

    const nuevoCliente = await clienteService.crearCliente(datos);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    if (error.code === '23505') {
      next(crearError(error, 'Ya existe un cliente con ese DNI', 400));
    } else {
      next(crearError(error, 'Error al crear el cliente', 500));
    }
  }
};

const obtenerClientes = async (req, res, next) => {
  try {
    const clientes = await clienteService.obtenerTodos();
    res.status(200).json(clientes);
  } catch (error) {
    next(crearError(error, 'Error al obtener clientes', 500));
  }
};

const obtenerClientePorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await clienteService.obtenerPorId(id);

    if (!cliente) {
      return next(crearError(null, 'Cliente no encontrado', 404));
    }

    res.status(200).json(cliente);
  } catch (error) {
    next(crearError(error, 'Error al buscar el cliente', 500));
  }
};

const actualizarCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    validarCliente(datos);

    const clienteActualizado = await clienteService.actualizarCliente(id, datos);

    if (!clienteActualizado) {
      return next(crearError(null, 'Cliente no encontrado', 404));
    }

    res.status(200).json(clienteActualizado);
  } catch (error) {
    next(crearError(error, 'Error al actualizar el cliente', 500));
  }
};

const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        mensaje: 'ID de cliente no proporcionado'
      });
    }

    const resultado = await clienteService.eliminarCliente(id);

    if (!resultado) {
      return res.status(200).json({
        success: true,
        mensaje: 'El cliente ya no existe o fue eliminado previamente',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      mensaje: 'Cliente eliminado correctamente',
      data: resultado
    });
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar cliente',
      error: error.message
    });
  }
};

const buscarClientePorDni = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const clientes = await clienteService.buscarPorDni(dni);

    res.status(200).json(clientes);
  } catch (error) {
    next(crearError(error, 'Error al buscar clientes por DNI', 500));
  }
};

const buscarClientePorNombre = async (req, res, next) => {
  try {
    const { nombre } = req.params;
    const clientes = await clienteService.buscarPorNombre(nombre);

    res.status(200).json(clientes);
  } catch (error) {
    next(crearError(error, 'Error al buscar clientes por nombre', 500));
  }
};

module.exports = {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
  buscarClientePorDni,
  buscarClientePorNombre,
};