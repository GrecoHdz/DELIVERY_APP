const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const PagoTransferencia = sequelize.define(
  "PagoTransferencia",
  {
    id_pago_transferencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_cuenta: {
      type: DataTypes.INTEGER,
      allowNull: true, // La cuenta bancaria es opcional
    },
    num_comprobante: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fecha_transferencia: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Fecha de transferencia automática
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "PagosTransferencia", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
PagoTransferencia.associate = (models) => {
  PagoTransferencia.belongsTo(models.Pago, {
    foreignKey: "id_pago",
    onDelete: "CASCADE", // Si se elimina el pago, también se eliminan sus transferencias asociadas
  });
  PagoTransferencia.belongsTo(models.CuentaBanco, {
    foreignKey: "id_cuenta",
    onDelete: "SET NULL", // Si se elimina la cuenta, el campo se establece como NULL
  });
};

module.exports = PagoTransferencia;