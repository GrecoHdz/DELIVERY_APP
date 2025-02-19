const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Pago = sequelize.define(
  "Pago",
  {
    id_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo_pago: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    id_referencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_local: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total_app: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total_driver: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    estado_pago: {
      type: DataTypes.STRING(55),
      defaultValue: "pendiente", // ('retenido', 'confirmado', 'finalizado')
    },
    fecha_confirmacion: {
      type: DataTypes.DATE,
      allowNull: true, // Fecha en que el cliente confirma la recepción
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Pagos", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
Pago.associate = (models) => {
  Pago.belongsTo(models.MetodoPago, {
    foreignKey: "id_metodo_pago",
    onDelete: "CASCADE", // Si se elimina el método de pago, también se eliminan los pagos asociados
  });
};

module.exports = Pago;