const Config = require("../models/Config");
const { sequelize } = require("../config/database");

console.log('Iniciando script de configuración...');

// Función para inicializar la configuración
async function initConfig() {
  console.log('Conectando a la base de datos...');
  try {
    // Verificar si la tabla existe
    try {
      await sequelize.query(`SELECT 1 FROM config LIMIT 1`);
      console.log('La tabla config ya existe');
    } catch (error) {
      console.log('La tabla config no existe, creándola...');
      await sequelize.sync({ force: false });
    }

    // Verificar si ya hay configuración
    const existingConfig = await Config.findOne();

    if (existingConfig) {
      console.log('Ya existe una configuración:', existingConfig.toJSON());
      return;
    }

    // Crear configuración por defecto
    const config = await Config.create({
      comision_productos: 15.00, // 15% de comisión por defecto
    });

    console.log('Configuración inicializada con éxito:', config.toJSON());
  } catch (error) {
    console.error('Error al inicializar la configuración:', error);
  } finally {
    // Cerrar la conexión
    await sequelize.close();
  }
}

// Ejecutar la función
initConfig();
