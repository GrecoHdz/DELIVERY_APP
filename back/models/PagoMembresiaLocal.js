const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const PagoMembresiaLocal = sequelize.define(
  "PagoMembresiaLocal",
  {
    id_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_local: {
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
      type: DataTypes.ENUM("pendiente", "aprobado", "denegada"),
      defaultValue: "pendiente", // Estado inicial del pago
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "PagoMembresiaLocal", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
PagoMembresiaLocal.associate = (models) => {
  PagoMembresiaLocal.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE", // Si se elimina el local, también se eliminan sus pagos asociados
  });
  PagoMembresiaLocal.belongsTo(models.Membresia, {
    foreignKey: "id_membresia",
    onDelete: "CASCADE", // Si se elimina la membresía, también se eliminan sus pagos asociados
  });
};

module.exports = PagoMembresiaLocal;