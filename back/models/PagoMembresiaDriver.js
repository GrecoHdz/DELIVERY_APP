const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const PagoMembresiaDriver = sequelize.define(
  "PagoMembresiaDriver",
  {
    id_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_membresia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deposito_url: {
      type: DataTypes.TEXT,
      allowNull: true, // La URL de depósito es opcional
    },
    fecha_pago: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Fecha de pago automática
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "aprobado", "denegado"),
      defaultValue: "pendiente", // Estado inicial del pago
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "PagoMembresiaDriver", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
PagoMembresiaDriver.associate = (models) => {
  PagoMembresiaDriver.belongsTo(models.Driver, {
    foreignKey: "id_driver",
    onDelete: "CASCADE", // Si se elimina el driver, también se eliminan sus pagos asociados
  });
  PagoMembresiaDriver.belongsTo(models.Membresia, {
    foreignKey: "id_membresia",
    onDelete: "CASCADE", // Si se elimina la membresía, también se eliminan sus pagos asociados
  });
};

module.exports = PagoMembresiaDriver;