const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const DriverVehiculo = sequelize.define(
  "DriverVehiculo",
  {
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
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Driver_Vehiculo", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
DriverVehiculo.associate = (models) => {
  DriverVehiculo.belongsTo(models.Driver, {
    foreignKey: "id_driver",
    onDelete: "CASCADE", // Si se elimina el driver, también se eliminan sus relaciones con vehículos
  });
  DriverVehiculo.belongsTo(models.Vehiculo, {
    foreignKey: "id_vehiculo",
    onDelete: "CASCADE", // Si se elimina el vehículo, también se eliminan sus relaciones con drivers
  });
};

module.exports = DriverVehiculo;