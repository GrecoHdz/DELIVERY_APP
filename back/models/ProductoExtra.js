const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de configurar tu conexión a la base de datos

const ProductoExtra = sequelize.define('ProductoExtra', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  id_extra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'Producto_Extra',
  timestamps: false, // Desactiva los campos createdAt y updatedAt
});

module.exports = ProductoExtra;