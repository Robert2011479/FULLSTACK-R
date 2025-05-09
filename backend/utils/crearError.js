//utils/crearError.js
const errorTypes = {
    ValidationError: { code: 1001, status: 400, type: 'VALIDATION_ERROR' },
    NotFound: { code: 1002, status: 404, type: 'NOT_FOUND' },
    DatabaseError: { code: 1003, status: 500, type: 'DATABASE_ERROR' },
    Unauthorized: { code: 1004, status: 401, type: 'UNAUTHORIZED' },
    Forbidden: { code: 1005, status: 403, type: 'FORBIDDEN' },
    InternalError: { code: 1999, status: 500, type: 'INTERNAL_ERROR' }
};

const crearError = (error, mensaje, statusCode = 500, detalles = null) => {
    // Si ya es un error creado con esta función, lo retornamos
    if (error && error.isCustomError) {
        return error;
    }

    const err = new Error(mensaje);
    err.isCustomError = true;
    
    // Buscar el tipo de error correspondiente
    const foundType = Object.values(errorTypes).find(t => t.status === statusCode) || errorTypes.InternalError;
    
    err.errorCode = foundType.code;
    err.statusCode = statusCode;
    err.errorType = foundType.type;
    err.detalles = detalles || (error ? error.message : null);
    err.timestamp = new Date().toISOString();
    
    // Mantener el stack trace si existe
    if (error && error.stack) {
        err.stack = error.stack;
    } else {
        Error.captureStackTrace(err, crearError);
    }
    
    return err;
};

module.exports = {crearError,errorTypes};