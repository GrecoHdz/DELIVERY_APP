const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Producto = sequelize.define(
  "Producto",
  {
    id_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_subcategoria: {
      type: DataTypes.INTEGER,
      allowNull: true, // Opcional si no todas las categorías son obligatorias
    },
    nombre_producto: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    descripcion_producto: {
      type: DataTypes.TEXT,
      allowNull: true, // Descripción opcional
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    preciooferta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // Puede ser opcional si no todos los productos tienen un precio de oferta
    },
    precioofertafinal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // Puede ser opcional si no todos los productos tienen un precio de oferta
    },
    preciofinal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    imagen_url: {
      type: DataTypes.TEXT,
      allowNull: true, // URL de la imagen (opcional)
    },
    imagen_public_id: {
      type: DataTypes.STRING,
      allowNull: true, // ID público de Cloudinary (necesario para eliminar imágenes)
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Productos", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
Producto.associate = (models) => {
  Producto.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE", // Si se elimina el local, también se eliminan sus productos
  });
  Producto.belongsTo(models.Subcategoria, {
    foreignKey: "id_subcategoria",
    onDelete: "SET NULL", // Si se elimina la subcategoría, el campo se establece como NULL
  });
};

module.exports = Producto;