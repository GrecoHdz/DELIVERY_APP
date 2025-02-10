const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const UsuarioRol = sequelize.define("UsuarioRol", {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: "Usuarios", // Nombre de la tabla referenciada
      key: "id_usuario", // Clave primaria de la tabla referenciada
    },
    onDelete: "CASCADE", // Elimina la relación si se elimina el usuario
    onUpdate: "CASCADE", // Actualiza la relación si se actualiza el usuario
  },
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: true,
    references: {
      model: "Roles", // Nombre de la tabla referenciada
      key: "id_rol", // Clave primaria de la tabla referenciada
    },
    onDelete: "CASCADE", // Elimina la relación si se elimina el rol
    onUpdate: "CASCADE", // Actualiza la relación si se actualiza el rol
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false, // Desactiva los timestamps automáticos de Sequelize
  tableName: "UsuarioRoles", // Nombre de la tabla en la base de datos
});

module.exports = UsuarioRol;