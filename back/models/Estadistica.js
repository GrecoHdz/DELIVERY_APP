const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Estadistica = sequelize.define("Estadistica", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pedidos: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  ubers: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  mandaditos: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, {
  timestamps: false,
  tableName: "Estadisticas"
});

module.exports = Estadistica;