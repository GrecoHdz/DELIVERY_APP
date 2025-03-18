const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Config = sequelize.define(
  "Config",
  {
    id_config: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comision_productos: {
      type: DataTypes.DECIMAL(5, 2), // Porcentaje de comisión
      allowNull: false,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "config", // Nombre de la tabla en la base de datos
  }
);

// Exportar el modelo
module.exports = Config;