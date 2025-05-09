//utils/validarDatos.js
const { crearError } = require('./crearError');

const validarUsuario = (usuario) => {
    const errores = [];
    
    if (!usuario.nombre || typeof usuario.nombre !== 'string') {
        errores.push({ field: 'nombre', message: 'Nombre de usuario inválido' });
    }
    
    if (!usuario.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.correo)) {
        errores.push({ field: 'correo', message: 'Correo electrónico inválido' });
    }
    
    if (!usuario.contraseña || usuario.contraseña.length < 6) {
        errores.push({ field: 'contraseña', message: 'La contraseña debe tener al menos 6 caracteres' });
    }
    
    if (!['admin', 'vendedor'].includes(usuario.rol)) {
        errores.push({ field: 'rol', message: 'Rol inválido' });
    }
    
    if (errores.length > 0) {
        const error = crearError(null, 'Datos de usuario inválidos', 400, errores);
        error.errorType = 'VALIDATION_ERROR';
        throw error;
    }
};

const validarProducto = (producto) => {
    const errores = [];
    
    if (!producto.nombre || typeof producto.nombre !== 'string') {
        errores.push({ field: 'nombre', message: 'Nombre de producto inválido' });
    }
    
    if (typeof producto.precio !== 'number' || producto.precio <= 0) {
        errores.push({ field: 'precio', message: 'Precio inválido' });
    }
    
    if (typeof producto.stock !== 'number' || producto.stock < 0) {
        errores.push({ field: 'stock', message: 'Stock inválido' });
    }
    
    if (typeof producto.stock_minimo !== 'number' || producto.stock_minimo < 0) {
        errores.push({ field: 'stock_minimo', message: 'Stock mínimo inválido' });
    }
    
    if (errores.length > 0) {
        const error = crearError(null, 'Datos de producto inválidos', 400, errores);
        error.errorType = 'VALIDATION_ERROR';
        throw error;
    }
};
function validarVenta({ id_usuario, total, detalles }) {
    if (!id_usuario || !total || !Array.isArray(detalles) || detalles.length === 0) {
        const error = new Error("Datos de venta inválidos");
        error.code = 1001;
        throw error;
    }

    for (const detalle of detalles) {
        if (!detalle.id_producto || !detalle.cantidad || !detalle.subtotal) {
            const error = new Error("Datos incompletos en los detalles de venta");
            error.code = 1002;
            throw error;
        }
    }
}
const validarCliente = (datos) => {
    const { dni, nombre, apellido_pat, apellido_mat } = datos;
    
    if (!dni || !nombre || !apellido_pat || !apellido_mat) {
        throw new Error('DNI, nombre y apellidos son obligatorios');
    }
    
    if (dni.length < 8 || dni.length > 20) {
        throw new Error('El DNI debe tener entre 8 y 20 caracteres');
    }
};
module.exports = {
    validarCliente,
    validarUsuario,
    validarProducto,
    validarVenta
};