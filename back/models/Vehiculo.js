const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de configurar tu conexión a la base de datos

const Vehiculo = sequelize.define('Vehiculo', {
  id_vehiculo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo_vehiculo: {
    type: DataTypes.STRING(55),
    allowNull: false,
    validate: {
      isIn: [['auto', 'moto', 'bicicleta', 'camion']],
    },
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
    allowNull: true,
  },
  disponible_para_renta: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'Vehiculos',
  timestamps: false, // Desactiva los campos createdAt y updatedAt
});

module.exports = Vehiculo;