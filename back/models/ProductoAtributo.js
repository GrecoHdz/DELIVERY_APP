const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ProductoAtributo = sequelize.define(
  "ProductoAtributo",
  {
    id_producto_atributo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_valor_atributo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio_adicional: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Producto_Atributos", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
ProductoAtributo.associate = (models) => {
  ProductoAtributo.belongsTo(models.Producto, {
    foreignKey: "id_producto",
    onDelete: "CASCADE", // Si se elimina el producto, también se eliminan sus atributos asociados
  });
  ProductoAtributo.belongsTo(models.ValorAtributo, {
    foreignKey: "id_valor_atributo",
    onDelete: "CASCADE", // Si se elimina el valor de atributo, también se eliminan sus relaciones con productos
  });
};

module.exports = ProductoAtributo;