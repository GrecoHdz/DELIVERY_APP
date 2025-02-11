const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Banco = sequelize.define("Banco", {
  id_banco: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_banco: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
  timestamps: false,
  tableName: "Bancos"
});

module.exports = Banco;