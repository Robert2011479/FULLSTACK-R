//middlewares/manejoErrores.js
const { crearError, errorTypes } = require('../utils/crearError');

const manejoErrores = (err, req, res, next) => {
    // Log del error completo
    console.error(`[${new Date().toISOString()}] Error:`, {
        message: err.message,
        code: err.errorCode || 'N/A',
        status: err.statusCode || 500,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        detalles: err.detalles
    });

    // Determinar el tipo de respuesta
    let response = {
        status: err.statusCode >= 500 ? 'error' : 'fail',
        error: {
            code: err.errorCode || errorTypes.InternalError.code,
            type: err.errorType || errorTypes.InternalError.type,
            message: err.message || 'Ocurrió un error inesperado'
        }
    };

    // Añadir detalles para errores de validación
    if (err.errorType === 'VALIDATION_ERROR' && err.detalles) {
        response.error.details = Array.isArray(err.detalles) 
            ? err.detalles 
            : [{ message: err.detalles }];
    }

    // Errores de base de datos (PostgreSQL)
    if (err.code && (err.code.startsWith('22') || err.code === '23505')) {
        response.error.type = 'DATABASE_ERROR';
        response.error.code = errorTypes.DatabaseError.code;
        response.error.message = 'Error de base de datos';
        if (process.env.NODE_ENV === 'development') {
            response.error.details = err.detail;
        }
    }

    // Errores de express-validator
    if (err.errors && Array.isArray(err.errors) && err.errors[0]?.msg) {
        response.error.type = 'VALIDATION_ERROR';
        response.error.code = errorTypes.ValidationError.code;
        response.error.details = err.errors.map(e => ({
            field: e.param,
            message: e.msg
        }));
    }

    res.status(err.statusCode || 500).json(response);
};

module.exports = { manejoErrores };