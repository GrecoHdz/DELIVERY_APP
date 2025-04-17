const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const OfertaDriver = sequelize.define(
  "OfertaDriver",
  {
    id_oferta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_viaje: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_vehiculo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    precio_oferta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado_oferta: {
      type: DataTypes.ENUM("pendiente", "aceptada"),
      defaultValue: "pendiente", // Estados: 'pendiente', 'aceptada'
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "OfertasDrivers", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
OfertaDriver.associate = (models) => {
  OfertaDriver.belongsTo(models.Viaje, {
    foreignKey: "id_viaje",
    onDelete: "CASCADE", // Si se elimina el viaje, también se eliminan sus ofertas asociadas
  });
  OfertaDriver.belongsTo(models.Pedido, {
    foreignKey: "id_pedido",
    onDelete: "CASCADE", // Si se elimina el pedido, también se eliminan sus ofertas asociadas
  });
  OfertaDriver.belongsTo(models.Driver, {
    foreignKey: "id_driver",
    onDelete: "CASCADE", // Si se elimina el driver, también se eliminan sus ofertas asociadas
  });
  OfertaDriver.belongsTo(models.Vehiculo, {
    foreignKey: "id_vehiculo",
    onDelete: "CASCADE", // Si se elimina el vehículo, también se eliminan sus ofertas asociadas
  });
};

module.exports = OfertaDriver;