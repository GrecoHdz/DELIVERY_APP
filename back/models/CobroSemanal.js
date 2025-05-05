const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const CobroSemanal = sequelize.define(
  "cobros_semanales",
  {
    id_cobro: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "locales",
        key: "id_local",
      },
    },
    num_factura: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    periodo_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    periodo_fin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ventas_efectivo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    ventas_tarjeta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    comision_efectivo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    comision_tarjeta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    pedidos_extra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    costo_pedidos_extra: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "pagado", "vencido"),
      allowNull: false,
      defaultValue: "pendiente",
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    comprobante_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "cobros_semanales",
  }
);

module.exports = CobroSemanal;
