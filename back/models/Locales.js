const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Locales = sequelize.define('Locales', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  precio: { type: DataTypes.FLOAT, allowNull: false },
}, {
  timestamps: true,
  tableName: 'productos'
});

module.exports = Locales;
