//app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { manejoErrores } = require('./middlewares/manejoErrores');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Middleware para forzar JSON
app.use((req, res, next) => {
  if (req.headers['content-type'] && !req.headers['content-type'].includes('application/json')) {
    return res.status(400).json({
      status: 'fail',
      message: 'El Content-Type debe ser application/json'
    });
  }
  next();
});
// 5. Rutas
app.use('/api/usuarios', require('./routers/usuarioRouter'));
app.use('/api/productos', require('./routers/productoRouter'));
app.use('/api/ventas', require('./routers/ventaRouter'));
app.use('/api/clientes', require('./routers/clienteRouter'));

// 6. Manejo de errores (SIEMPRE al final)
app.use(manejoErrores);

module.exports = app;