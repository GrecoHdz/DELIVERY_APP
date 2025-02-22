const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Viaje = sequelize.define(
  "Viaje",
  {
    id_viaje: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: true, // El driver es opcional hasta que se asigne
    },
    id_vehiculo: {
      type: DataTypes.INTEGER,
      allowNull: true, // El vehículo es opcional hasta que se asigne
    },
    direccion_recogida: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    direccion_destino: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tiempo_llegada_estimado: {
      type: DataTypes.INTEGER,
      allowNull: true, // Tiempo en minutos (opcional)
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: true, // Fecha de inicio es opcional hasta que el viaje comience
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true, // Fecha de finalización es opcional hasta que el viaje termine
    },
    estado: {
      type: DataTypes.STRING(55),
      defaultValue: "pendiente", // Estados: 'pendiente', 'aceptado', 'en_camino', 'finalizado'
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // La tarifa es opcional hasta que se confirme
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Viajes", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
Viaje.associate = (models) => {
  Viaje.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE", // Si se elimina el cliente, también se eliminan sus viajes
  });
  Viaje.belongsTo(models.Driver, {
    foreignKey: "id_driver",
    onDelete: "SET NULL", // Si se elimina el driver, el campo se establece como NULL
  });
  Viaje.belongsTo(models.Vehiculo, {
    foreignKey: "id_vehiculo",
    onDelete: "SET NULL", // Si se elimina el vehículo, el campo se establece como NULL
  });
};

module.exports = Viaje;