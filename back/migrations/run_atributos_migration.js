const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

async function runMigration() {
  // Crear conexión a la base de datos
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'delivery_app',
    multipleStatements: true // Permitir múltiples consultas en una sola ejecución
  });

  try {
    console.log('Conectado a la base de datos. Ejecutando migración...');

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'update_atributos_unique_constraint.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Ejecutar las consultas SQL
    await connection.query(sql);

    console.log('Migración completada exitosamente.');
  } catch (error) {
    console.error('Error al ejecutar la migración:', error);
    
    // Si el error es que el índice no existe, podemos continuar con la creación del nuevo índice
    if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
      console.log('El índice no existe. Intentando crear el nuevo índice único...');
      
      try {
        // Crear solo el nuevo índice
        await connection.query('ALTER TABLE Atributos ADD CONSTRAINT atributo_producto_nombre_unique UNIQUE (id_producto, nombre_atributo);');
        console.log('Nuevo índice creado exitosamente.');
      } catch (innerError) {
        console.error('Error al crear el nuevo índice:', innerError);
      }
    }
  } finally {
    // Cerrar la conexión
    await connection.end();
    console.log('Conexión cerrada.');
  }
}

// Ejecutar la migración
runMigration();
