const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Atributo = sequelize.define(
  "Atributo",
  {
    id_atributo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_atributo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true, // Asegura que el nombre del atributo sea único
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Atributos", // Nombre de la tabla en la base de datos
  }
);

module.exports = Atributo;