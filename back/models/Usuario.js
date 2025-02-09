const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Usuario = sequelize.define("Usuario", {
  id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_rol: { type: DataTypes.INTEGER, allowNull: true },
  usuario: { type: DataTypes.STRING(50), allowNull: false },
  clave_hash: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: true, unique: true },
  estado: { type: DataTypes.ENUM('en linea', 'inactivo'), defaultValue: 'en linea' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fecha_ultimo_login: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  imagen_perfil_url: { type: DataTypes.TEXT },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: false, // Desactiva los timestamps automáticos de Sequelize
  tableName: "Usuarios",
});

module.exports = Usuario;
