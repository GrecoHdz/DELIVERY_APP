const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ProductoRecomendado = sequelize.define(
  "ProductoRecomendado",
  {
    id_recomendacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Productos_Recomendados", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
ProductoRecomendado.associate = (models) => {
  ProductoRecomendado.belongsTo(models.Producto, {
    foreignKey: "id_producto",
    onDelete: "CASCADE", // Si se elimina el producto, también se eliminan sus recomendaciones
  });
  ProductoRecomendado.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE", // Si se elimina el local, también se eliminan sus recomendaciones
  });
};

module.exports = ProductoRecomendado;