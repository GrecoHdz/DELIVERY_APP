const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Subcategoria = sequelize.define("Subcategoria", {
  id_subcategoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_subcategoria: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true, // Asegura que el nombre de la subcategoría sea único
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Categorias", // Nombre de la tabla referenciada
      key: "id_categoria", // Clave primaria de la tabla referenciada
    },
    onDelete: "CASCADE", // Elimina las subcategorías si se elimina la categoría asociada
    onUpdate: "CASCADE", // Actualiza las subcategorías si se actualiza la categoría asociada
  },
}, {
  timestamps: false, // Desactiva los timestamps automáticos de Sequelize
  tableName: "Subcategorias", // Nombre de la tabla en la base de datos
});

module.exports = Subcategoria;