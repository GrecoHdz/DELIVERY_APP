const { sequelize } = require("../config/database");

console.log('Iniciando actualización de la tabla Productos_Sucursales...');

async function updateTable() {
  try {
    console.log('Conectando a la base de datos...');
    
    // Verificar si la tabla existe
    try {
      await sequelize.query(`SELECT 1 FROM Productos_Sucursales LIMIT 1`);
      console.log('La tabla Productos_Sucursales existe');
      
      // Verificar si los campos ya existen
      try {
        await sequelize.query(`SELECT preciooferta FROM Productos_Sucursales LIMIT 1`);
        console.log('El campo preciooferta ya existe');
      } catch (error) {
        console.log('El campo preciooferta no existe, agregándolo...');
        await sequelize.query(`ALTER TABLE Productos_Sucursales ADD COLUMN preciooferta DECIMAL(10,2) NULL AFTER precio`);
        console.log('Campo preciooferta agregado con éxito');
      }
      
      try {
        await sequelize.query(`SELECT precioofertafinal FROM Productos_Sucursales LIMIT 1`);
        console.log('El campo precioofertafinal ya existe');
      } catch (error) {
        console.log('El campo precioofertafinal no existe, agregándolo...');
        await sequelize.query(`ALTER TABLE Productos_Sucursales ADD COLUMN precioofertafinal DECIMAL(10,2) NULL AFTER preciofinal`);
        console.log('Campo precioofertafinal agregado con éxito');
      }
      
    } catch (error) {
      console.error('Error al verificar la tabla Productos_Sucursales:', error);
      return;
    }
    
    console.log('Actualización completada con éxito');
  } catch (error) {
    console.error('Error durante la actualización:', error);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar la función
updateTable();
