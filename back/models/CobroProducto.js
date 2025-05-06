const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const CobroProducto = sequelize.define(
  "cobros_productos",
  {
    id_cobro_producto: {
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
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "productos",
        key: "id_producto",
      },
    },
    nombre_producto: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    metodo_pago: {
      type: DataTypes.ENUM("efectivo", "tarjeta"),
      allowNull: false,
    },
    fecha_venta: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    id_direccion_local: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "direcciones_locales",
        key: "id_direccion_local",
      },
    },
  },
  {
    timestamps: false,
    tableName: "cobros_productos",
  }
);

module.exports = CobroProducto;
