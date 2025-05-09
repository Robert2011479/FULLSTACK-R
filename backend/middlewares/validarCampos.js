//middlewares/validarCampos.js
const { body, validationResult } = require('express-validator');
const { crearError } = require('../utils/crearError');

const validaciones = {
    crearCliente: [
        body('dni').notEmpty().trim().withMessage('El DNI es requerido')
            .isLength({ min: 8, max: 20 }).withMessage('El DNI debe tener entre 8 y 20 caracteres'),
        body('nombre').notEmpty().trim().withMessage('El nombre es requerido')
            .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
        body('apellido_pat').notEmpty().trim().withMessage('El apellido paterno es requerido')
            .isLength({ min: 2 }).withMessage('El apellido paterno debe tener al menos 2 caracteres'),
        body('apellido_mat').notEmpty().trim().withMessage('El apellido materno es requerido')
            .isLength({ min: 2 }).withMessage('El apellido materno debe tener al menos 2 caracteres'),
        body('telefono').optional()
            .isLength({ min: 6, max: 15 }).withMessage('El teléfono debe tener entre 6 y 15 caracteres')
            .matches(/^[0-9()+-\s]+$/).withMessage('Formato de teléfono inválido'),
        body('direccion').optional()
            .isLength({ max: 255 }).withMessage('La dirección no puede exceder los 255 caracteres')
    ],

    actualizarCliente: [
        body('dni').optional()
            .isLength({ min: 8, max: 20 }).withMessage('El DNI debe tener entre 8 y 20 caracteres'),
        body('nombre').optional()
            .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
        body('apellido_pat').optional()
            .isLength({ min: 2 }).withMessage('El apellido paterno debe tener al menos 2 caracteres'),
        body('apellido_mat').optional()
            .isLength({ min: 2 }).withMessage('El apellido materno debe tener al menos 2 caracteres'),
        body('telefono').optional()
            .isLength({ min: 6, max: 15 }).withMessage('El teléfono debe tener entre 6 y 15 caracteres')
            .matches(/^[0-9()+-\s]+$/).withMessage('Formato de teléfono inválido'),
        body('direccion').optional()
            .isLength({ max: 255 }).withMessage('La dirección no puede exceder los 255 caracteres')
    ],
    crearUsuario: [
        body('nombre').notEmpty().trim().withMessage('El nombre es requerido'),
        body('correo').isEmail().normalizeEmail().withMessage('Correo electrónico inválido'),
        body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
        body('rol').isIn(['admin', 'vendedor']).withMessage('Rol inválido')
    ],
    actualizarUsuario: [
        body('nombre').optional().notEmpty().trim().withMessage('El nombre no puede estar vacío'),
        body('correo').optional().isEmail().normalizeEmail().withMessage('Correo electrónico inválido'),
        body('rol').optional().isIn(['admin', 'vendedor']).withMessage('Rol inválido')
    ],
    crearProducto: [
        body('nombre').notEmpty().trim().withMessage('El nombre es requerido'),
        body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
        body('stock').isInt({ min: 0 }).withMessage('El stock no puede ser negativo'),
        body('stock_minimo').isInt({ min: 0 }).withMessage('El stock mínimo no puede ser negativo')
    ],
    actualizarProducto: [
        body('nombre').optional().notEmpty().trim().withMessage('El nombre no puede estar vacío'),
        body('precio').optional().isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
        body('stock').optional().isInt({ min: 0 }).withMessage('El stock no puede ser negativo'),
        body('stock_minimo').optional().isInt({ min: 0 }).withMessage('El stock mínimo no puede ser negativo')
    ],
    crearVenta: [
        body('id_usuario').isInt({ min: 1 }).withMessage('ID de usuario inválido'),
        body('id_cliente').isInt({ min: 1 }).withMessage('ID de cliente inválido'),
        body('total').isFloat({ gt: 0 }).withMessage('El total debe ser mayor a 0'),
        body('detalles').isArray({ min: 1 }).withMessage('Debe haber al menos un producto en la venta'),
        body('detalles.*.id_producto').isInt({ min: 1 }).withMessage('ID de producto inválido'),
        body('detalles.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad inválida'),
        body('detalles.*.subtotal').isFloat({ gt: 0 }).withMessage('Subtotal inválido')
    ],
    // Agregar la validación para login
    login: [
        body('correo').isEmail().normalizeEmail().withMessage('Correo electrónico inválido'),
        body('contraseña').notEmpty().withMessage('La contraseña es requerida')
    ],
    actualizarDetalle: [
        body('cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser al menos 1'),
        body('subtotal').isFloat({ gt: 0 }).withMessage('Subtotal debe ser mayor a 0')
    ],
    crearVenta: [
        body('id_usuario').isInt({ min: 1 }).withMessage('ID de usuario inválido'),
        body('id_cliente').isInt({ min: 1 }).withMessage('ID de cliente inválido'),
        body('total').isFloat({ gt: 0 }).withMessage('El total debe ser mayor a 0'),
        body('detalles').isArray({ min: 1 }).withMessage('Debe haber al menos un producto en la venta'),
        body('detalles.*.id_producto').isInt({ min: 1 }).withMessage('ID de producto inválido'),
        body('detalles.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad inválida'),
        body('detalles.*.subtotal').isFloat({ gt: 0 }).withMessage('Subtotal inválido')
    ]
};

// El resto del archivo permanece igual...
const validarCampos = (tipo) => {
    // Verificar que el tipo existe en validaciones
    if (!validaciones[tipo]) {
        throw new Error(`Tipo de validación '${tipo}' no definido`);
    }

    return [
        // Usar concat en lugar del spread operator para mayor seguridad
        [].concat(validaciones[tipo]),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = crearError(
                    null, 
                    'Error de validación', 
                    400, 
                    errors.array().map(e => ({
                        field: e.param,
                        message: e.msg
                    }))
                );
                error.errorType = 'VALIDATION_ERROR';
                return next(error);
            }
            next();
        }
    ];
};

module.exports = { validarCampos };