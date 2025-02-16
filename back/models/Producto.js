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
      allowNull: true, // Puede ser nulo si no tiene subcategoría
    },
    nombre_producto: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion_producto: {
      type: DataTypes.TEXT,
      allowNull: true, // Descripción opcional
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    imagen_url: {
      type: DataTypes.TEXT,
      allowNull: true, // URL de la imagen (opcional)
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Productos", // Nombre de la tabla en la base de datos
    indexes: [
      {
        name: "idx_productos_local_activo",
        fields: ["id_local", "activo"],
      },
      {
        name: "idx_productos_id_local",
        fields: ["id_local"],
      },
      {
        name: "idx_productos_activo",
        fields: ["activo"],
      },
    ],
  }
);

// Relaciones con otras tablas
Producto.associate = (models) => {
  Producto.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE",
  });
  Producto.belongsTo(models.Subcategoria, {
    foreignKey: "id_subcategoria",
    onDelete: "SET NULL", // Si se elimina la subcategoría, el campo se establece como NULL
  });
};

module.exports = Producto;