//la carpeta testConnection.js para ejecular la conexion si fue exitosa
const db = require('./config/db');

(async ()=>{
    try {
        const result = await db.query('SELECT NOW()');
        console.log('Conexion exitosa a la fecha y hora actual:',result.rows[0])
    } catch (error) {
        console.error('Error de conexion',error);
    }
})();