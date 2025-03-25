const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Usuario = sequelize.define("Usuario", {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Roles", // Nombre de la tabla referenciada
      key: "id_rol", // Clave primaria de la tabla referenciada
    },
    onDelete: "CASCADE", // Elimina los usuarios si se elimina el rol asociado
    onUpdate: "CASCADE", // Actualiza los usuarios si se actualiza el rol asociado
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true, // Asegura que el nombre de usuario sea único
  },
  clave_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true, // Asegura que el email sea único
  },
  estado: {
    type: DataTypes.ENUM("en linea", "inactivo"),
    defaultValue: "en linea",
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_ultimo_login: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  imagen_perfil_url: {
    type: DataTypes.TEXT,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  reset_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reset_token_expires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: false, // Desactiva los timestamps automáticos de Sequelize
  tableName: "Usuarios", // Nombre de la tabla en la base de datos
});

module.exports = Usuario;