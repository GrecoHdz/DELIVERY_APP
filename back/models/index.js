const { sequelize } = require("../config/database"); 
const Usuario = require("./Usuario"); 

const syncDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Base de datos conectada correctamente.");

    await sequelize.sync({ alter: true })
    console.log("✅ Base de datos sincronizada.");
  } catch (error) {
    console.error("❌ Error al conectar la base de datos:", error);
  }
};

syncDB(); 
module.exports = { sequelize, Usuario };
