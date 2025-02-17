const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de configurar tu conexión a la base de datos

const DriverVehiculo = sequelize.define('DriverVehiculo', {
  id_driver: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  id_vehiculo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
}, {
  tableName: 'Driver_Vehiculo',
  timestamps: false, // Desactiva los campos createdAt y updatedAt
});

module.exports = DriverVehiculo;