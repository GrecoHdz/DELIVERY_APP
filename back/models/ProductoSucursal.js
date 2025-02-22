const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ProductoSucursal = sequelize.define(
  "ProductoSucursal",
  {
    id_producto_sucursal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_direccion_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // El precio es opcional (puede variar por sucursal)
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Por defecto, el producto está activo en la sucursal
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Productos_Sucursales", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
ProductoSucursal.associate = (models) => {
  ProductoSucursal.belongsTo(models.Producto, {
    foreignKey: "id_producto",
    onDelete: "CASCADE", // Si se elimina el producto, también se eliminan sus registros en sucursales
  });
  ProductoSucursal.belongsTo(models.DireccionLocal, {
    foreignKey: "id_direccion_local",
    onDelete: "CASCADE", // Si se elimina la dirección del local, también se eliminan sus registros
  });
};

module.exports = ProductoSucursal;