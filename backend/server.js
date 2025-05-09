//server.js
const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 3000;

// Verificar conexión a la base de datos
db.query('SELECT NOW()')
    .then(() => {
        console.log('Conexión a PostgreSQL establecida');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al conectar a PostgreSQL:', err);
        process.exit(1);
    });