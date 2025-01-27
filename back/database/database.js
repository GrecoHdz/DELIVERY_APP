const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

// Crear la conexión a la base de datos utilizando las variables de entorno
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // El número de conexiones simultáneas permitidas
  queueLimit: 0
});

// Función para obtener una conexión
const getConnection = async () => {
  try {
    const conn = await connection.getConnection();
    console.log('Conexión exitosa a la base de datos');
    return conn;
  } catch (error) {
    console.error('Error al conectar a la base de datos', error);
    throw error; // Lanza el error si hay problemas con la conexión
  }
}

// Función para obtener un usuario y comparar la contraseña
const getUser = async (username, password) => {
  const [rows] = await connection.execute('SELECT * FROM usuarios WHERE usuario = ?', [username]);

  console.log('Resultado de la consulta:', rows); // Verifica si se está obteniendo el usuario

  if (rows.length === 0) {
    return null;
  }

  const user = rows[0];
  if (user.password === password) {
    return user;
  }

  return null;
};


module.exports = { getConnection, getUser };
