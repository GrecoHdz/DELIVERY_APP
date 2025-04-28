const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Recomendado = sequelize.define(
  "Recomendado",
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
    sucursales: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Recomendados", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
Recomendado.associate = (models) => {
  Recomendado.belongsTo(models.Producto, {
    foreignKey: "id_producto",
    onDelete: "CASCADE", // Si se elimina el producto, también se eliminan sus recomendaciones
  });
  Recomendado.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE", // Si se elimina el local, también se eliminan sus recomendaciones
  });
};

module.exports = Recomendado;