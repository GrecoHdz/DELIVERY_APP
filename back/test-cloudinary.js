const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Mostrar la configuración actual (sin mostrar la API secret completa)
console.log('Configuración de Cloudinary:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret (primeros 4 caracteres):', process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.substring(0, 4) + '...' : 'No definido');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Función para probar la conexión
async function testCloudinaryConnection() {
  try {
    // Intentar obtener información de la cuenta
    const result = await cloudinary.api.ping();
    console.log('Conexión exitosa a Cloudinary:', result);
    return true;
  } catch (error) {
    console.error('Error al conectar con Cloudinary:', error);
    return false;
  }
}

// Ejecutar la prueba
testCloudinaryConnection()
  .then(success => {
    if (success) {
      console.log('La configuración de Cloudinary es correcta.');
    } else {
      console.log('Hay un problema con la configuración de Cloudinary.');
    }
  });
