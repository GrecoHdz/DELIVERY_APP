const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const MetodoPago = sequelize.define("MetodoPago", {
  id_metodo_pago: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tipo_pago: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
  timestamps: false,
  tableName: "MetodosPago"
});

module.exports = MetodoPago;