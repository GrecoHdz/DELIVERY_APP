const { sequelize } = require("../config/database");
const Usuario = require("./Usuario");

// Nota: Las migraciones deben manejarse manualmente usando un sistema de migraciones
// Ejecutar migraciones por separado usando una herramienta de migraciones

module.exports = {
  sequelize,
  Usuario
};
