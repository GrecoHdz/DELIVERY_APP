const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Historial = sequelize.define(
  "Historial",
  {
    id_historial: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo_historial: {
      type: DataTypes.ENUM("pedido", "viaje", "renta", "mandadito"),
      allowNull: false,
    },
    id_referencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_vehiculo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_local: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    direccion_recogida: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    direccion_destino: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Historial", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
Historial.associate = (models) => {
  Historial.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE", // Si se elimina el cliente, también se eliminan sus registros de historial
  });
  Historial.belongsTo(models.Driver, {
    foreignKey: "id_driver",
    onDelete: "SET NULL", // Si se elimina el driver, el campo id_driver se establece en NULL
  });
  Historial.belongsTo(models.Vehiculo, {
    foreignKey: "id_vehiculo",
    onDelete: "SET NULL", // Si se elimina el vehículo, el campo id_vehiculo se establece en NULL
  });
  Historial.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "SET NULL", // Si se elimina el local, el campo id_local se establece en NULL
  });
};

module.exports = Historial;