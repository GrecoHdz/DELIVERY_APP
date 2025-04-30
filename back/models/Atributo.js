const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Atributo = sequelize.define(
  "Atributo",
  {
    id_atributo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre_atributo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // Quitamos la restricción unique: true para permitir el mismo nombre en diferentes productos
    },
    valor: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    precio_adicional: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0, // Precio adicional por defecto es 0.00
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Atributos", // Nombre de la tabla en la base de datos
    indexes: [
      {
        // Creamos un índice único compuesto por id_producto y nombre_atributo
        // Esto permite tener el mismo nombre de atributo en diferentes productos
        // pero no permite duplicados dentro del mismo producto
        unique: true,
        fields: ['id_producto', 'nombre_atributo'],
        name: 'atributo_producto_nombre_unique'
      }
    ]
  }
);

// Asociaciones
Atributo.associate = (models) => {
  Atributo.belongsTo(models.Producto, {
    foreignKey: "id_producto",
    onDelete: "CASCADE", // Si se elimina el producto, también se eliminan sus atributos
  });
};

module.exports = Atributo;