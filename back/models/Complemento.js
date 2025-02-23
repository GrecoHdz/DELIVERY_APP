const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Complemento = sequelize.define(
  "Complemento",
  {
    id_complemento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Complementos", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
Complemento.associate = (models) => {
  Complemento.belongsTo(models.Producto, {
    foreignKey: "id_producto",
    onDelete: "CASCADE", // Si se elimina el producto, también se eliminan sus complementos asociados
  });
};

module.exports = Complemento;