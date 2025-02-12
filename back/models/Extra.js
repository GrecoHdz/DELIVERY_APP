const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Extra = sequelize.define("Extra", {
  id_extra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true, // Asegura que el nombre del extra sea único
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0, // Precio por defecto es 0
  },
}, {
  timestamps: false, // Desactiva los timestamps automáticos de Sequelize
  tableName: "Extras", // Nombre de la tabla en la base de datos
});

module.exports = Extra;