const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const MembresiaLocal = sequelize.define("MembresiaLocal", {
  id_membresia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_membresia: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true, // Asegura que el nombre de la membresía sea único
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  deliveries_gratuitos: {
    type: DataTypes.INTEGER,
  },
  precio_delivery_extra: {
    type: DataTypes.INTEGER,
  },
  limite_recomendaciones: {
    type: DataTypes.INTEGER,
    defaultValue: 1, // Por defecto, 1 recomendación
  },
}, {
  timestamps: false, // Desactiva los timestamps automáticos de Sequelize
  tableName: "MembresiasLocales", // Nombre de la tabla en la base de datos
});

module.exports = MembresiaLocal;