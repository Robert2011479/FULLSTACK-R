//controllers/productoController.js
const productoService = require('../services/productoService');
const { crearError } = require('../utils/crearError');
const { validarProducto } = require('../utils/validarDatos');

// Crear nuevo producto
const crearProducto = async (req, res, next) => {
  try {
    const datos = req.body;
    if (typeof datos.precio === 'string') datos.precio = parseFloat(datos.precio);

    validarProducto(datos);

    const nuevoProducto = await productoService.crearProducto(datos);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    if (error.code === '23505') {
      next(crearError(error, 'Ya existe un producto con ese nombre', 400));
    } else {
      next(crearError(error, 'Error al crear el producto', 500));
    }
  }
};

// Obtener todos los productos
const obtenerProductos = async (req, res, next) => {
  try {
    const productos = await productoService.obtenerTodos();
    res.status(200).json(productos);
  } catch (error) {
    next(crearError(error, 'Error al obtener productos', 500));
  }
};

// Obtener un producto por ID
const obtenerProductoPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const producto = await productoService.obtenerPorId(id);

    if (!producto) {
      return next(crearError(null, 'Producto no encontrado', 404));
    }

    res.status(200).json(producto);
  } catch (error) {
    next(crearError(error, 'Error al buscar el producto', 500));
  }
};

// Actualizar producto
const actualizarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    if (typeof datos.precio === 'string') datos.precio = parseFloat(datos.precio);

    validarProducto(datos);

    const productoActualizado = await productoService.actualizarProducto(id, datos);

    if (!productoActualizado) {
      return next(crearError(null, 'Producto no encontrado', 404));
    }

    res.status(200).json(productoActualizado);
  } catch (error) {
    next(crearError(error, 'Error al actualizar el producto', 500));
  }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        mensaje: 'ID de producto no proporcionado'
      });
    }

    const resultado = await productoService.eliminarProducto(id);

    if (!resultado) {
      return res.status(200).json({
        success: true,
        mensaje: 'El producto ya no existe o fue eliminado previamente',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      mensaje: 'Producto eliminado correctamente',
      data: resultado
    });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar producto',
      error: error.message
    });
  }
};

// Buscar productos por nombre
const buscarProductoPorNombre = async (req, res, next) => {
  try {
    const { nombre } = req.params;
    const productos = await productoService.buscarPorNombre(nombre);

    res.status(200).json(productos);
  } catch (error) {
    next(crearError(error, 'Error al buscar productos por nombre', 500));
  }
};

// Obtener productos con bajo stock
const obtenerProductosBajoStock = async (req, res, next) => {
  try {
    const productos = await productoService.obtenerProductosBajoStock();
    res.status(200).json(productos);
  } catch (error) {
    next(crearError(error, 'Error al obtener productos con bajo stock', 500));
  }
};

// Exportar todos los controladores
module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  buscarProductoPorNombre,
  obtenerProductosBajoStock,
};
