const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const AutoEnRenta = sequelize.define(
  "AutoEnRenta",
  {
    id_auto_en_renta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_vehiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    direccion_recogida: {
      type: DataTypes.STRING(255),
      allowNull: true, // Dirección de recogida es opcional
    },
    precio_por_dia: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    opcion_conductor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Por defecto, no se ofrece renta con conductor
    },
    entrega_a_domicilio: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Por defecto, no se ofrece entrega a domicilio
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Por defecto, el auto está activo para renta
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Autos_en_renta", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
AutoEnRenta.associate = (models) => {
  AutoEnRenta.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE", // Si se elimina el cliente, también se eliminan sus autos en renta
  });
  AutoEnRenta.belongsTo(models.Vehiculo, {
    foreignKey: "id_vehiculo",
    onDelete: "CASCADE", // Si se elimina el vehículo, también se eliminan sus registros de renta
  });
  AutoEnRenta.belongsTo(models.MetodoPago, {
    foreignKey: "id_metodo_pago",
    onDelete: "CASCADE", // Si se elimina el método de pago, también se eliminan sus registros asociados
  });
};

module.exports = AutoEnRenta;