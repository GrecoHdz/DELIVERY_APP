const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Categoria = sequelize.define("Categoria", {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_categoria: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true, // Asegura que el nombre de la categoría sea único
  },
}, {
  timestamps: false, // Desactiva los timestamps automáticos de Sequelize
  tableName: "Categorias", // Nombre de la tabla en la base de datos
});

module.exports = Categoria;