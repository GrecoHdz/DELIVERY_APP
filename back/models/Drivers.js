const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de configurar tu conexión a la base de datos

const Driver = sequelize.define('Driver', {
  id_driver: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  membresia_driver: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  tableName: 'Drivers',
  timestamps: false, // Desactiva los campos createdAt y updatedAt
});

module.exports = Driver;