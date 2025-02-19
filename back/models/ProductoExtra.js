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
    id_extra: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    onDelete: "CASCADE", // Si se elimina el producto, también se eliminan sus relaciones con extras
  });
  ProductoExtra.belongsTo(models.Extra, {
    foreignKey: "id_extra",
    onDelete: "CASCADE", // Si se elimina el extra, también se eliminan sus relaciones con productos
  });
};

module.exports = ProductoExtra;