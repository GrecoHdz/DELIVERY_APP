const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ProductoExtra = sequelize.define(
  "ProductoExtra",
  {
    id_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Por defecto, el extra está activo
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Producto_Extra", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
ProductoExtra.associate = (models) => {
  ProductoExtra.belongsTo(models.Producto, {
    foreignKey: "id_producto",
    onDelete: "CASCADE", // Si se elimina el producto, también se eliminan sus extras
  });
};

module.exports = ProductoExtra;