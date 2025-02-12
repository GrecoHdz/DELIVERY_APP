const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Cliente = sequelize.define(
  "Cliente",
  {
    id_cliente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true, // Relación con la tabla usuarios
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    identidad: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY, // Solo fecha (sin hora)
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Clientes", // Nombre de la tabla en la base de datos
  }
);

module.exports = Cliente;