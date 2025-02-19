const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const PagoEfectivo = sequelize.define(
  "PagoEfectivo",
  {
    id_pago_efectivo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cambio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // El cambio es opcional
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "PagosEfectivo", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
PagoEfectivo.associate = (models) => {
  PagoEfectivo.belongsTo(models.Pago, {
    foreignKey: "id_pago",
    onDelete: "CASCADE", // Si se elimina el pago, también se eliminan sus registros de efectivo asociados
  });
};

module.exports = PagoEfectivo;