const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de configurar tu conexión a la base de datos

const MembresiaDriver = sequelize.define('MembresiaDriver', {
  id_membresia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_driver: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  saldo_solicitado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  comprobante: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'MembresiasDrivers',
  timestamps: false, // Desactiva los campos createdAt y updatedAt
});

module.exports = MembresiaDriver;