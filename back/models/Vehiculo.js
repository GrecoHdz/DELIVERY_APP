const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Vehiculo = sequelize.define(
  "Vehiculo",
  {
    id_vehiculo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo_vehiculo: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: true, // Capacidad es opcional
    },
    marca: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    modelo: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imagen_url: {
      type: DataTypes.TEXT,
      allowNull: true, // URL de la imagen es opcional
    },
    disponible_para_renta: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Por defecto, no está disponible para renta
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Vehiculos", // Nombre de la tabla en la base de datos
  }
);

module.exports = Vehiculo;